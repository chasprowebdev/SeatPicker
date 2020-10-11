import React from 'react'
import SeatPicker from 'react-seat-picker';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

const ROW_NUM = 8;
const COLUMN_NUM = 8;
const ROW_STEP = 4;
const COLUMN_STEP = 4;
const PRICE_TOP = 50
const PRICE_BOTTOM = 20

class SeatPickerComponent extends React.Component {
  constructor(props) {
    super(props)

    const rows = this.generateSeatMap()

    this.state = {
      loading: false,
      selected: false,
      confirmed: false,
      selectedSeat: {},
      rows,
      totalPrice: 0,
    }
  }

  addSeatCallback = ({ row, number, id }, addCb) => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        addCb(row, number, id, '');
        let { totalPrice } = this.state
        totalPrice += Number(number.slice(1))
        this.setState({ loading: false, selected: true, selectedSeat: { row, number, id }, totalPrice });
      }
    );
  };

  addSeatCallbackContinousCase = (
    { row, number, id },
    addCb,
    params,
    removeCb
  ) => {
    this.setState(
      {
        loading: true
      },
      async () => {
        if (removeCb) {
          removeCb(params.row, params.number);
        }
        addCb(row, number, id, '');
        this.setState({ loading: false });
      }
    );
  };

  removeSeatCallback = ({ row, number, id }, removeCb) => {
    this.setState(
      {
        loading: true
      },
      async () => {
        removeCb(row, number, '');
        this.setState({ loading: false });
      }
    );
  };

  generateSeatMap = () => {
    let rows = []
    for( let i = 0; i < ROW_NUM; i++ ) {
      let row = []
      for( let j = 0; j < COLUMN_NUM; j++ ) {
        const price = PRICE_BOTTOM + Math.floor(Math.random() * (PRICE_TOP - PRICE_BOTTOM));
        const entry = {
          id: i * COLUMN_NUM + j,
          number: `$${price}`,
          isReserved: Math.random() > 0.7,
        }
        if (j != 0 && j % COLUMN_STEP == 0) {
          row.push(null)  
        }
        row.push(entry)
      }
      rows.push(row)
    }

    // special
    rows[0][0] = null
    rows[0][8] = null
    return rows
  }

  seatConfirmed = () => {
    this.setState({ confirmed: true })
  }

  render() {
    const { loading, selected, confirmed, selectedSeat, rows, totalPrice } = this.state

    return (
      <div className="seat-select">
        {!confirmed && (
          <React.Fragment>
            <div className="seat-picker-header">
              {Array.from(Array(8).keys()).map((item, index) => (
                <div key={index} className="seat-picker-header-column">
                  { index + 1 }
                </div>
              ))}
            </div>
            <SeatPicker
              addSeatCallback={this.addSeatCallback}
              removeSeatCallback={this.removeSeatCallback}
              rows={rows}
              maxReservableSeats={100}
              alpha
              visible
              selectedByDefault
              loading={loading}
              tooltipProps={{ multiline: true }}
            />
            <div className="seat-picker-action">
              {selected && (
                <Button variant="success" onClick={this.seatConfirmed}>{`Confirm Selection ($${totalPrice})`}</Button>
              )}
              {!selected && (
                <Button variant="light" disabled>Select a Seat</Button>
              )}
            </div>
          </React.Fragment>
        )}
        {confirmed && (
          <div className="seat-confirm-box">
            <i className="fa fa-check" />
            <span className="seat-confirmed">{`Seat $${totalPrice} Confirmed`}</span>
          </div>
        )}
      </div>
    )
  }
}

export default SeatPickerComponent;