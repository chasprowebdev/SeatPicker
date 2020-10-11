import React from 'react'
import SeatPicker from 'react-seat-picker';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

const ROW_NUM = 8;
const COLUMN_NUM = 8;
const ROW_STEP = 4;
const COLUMN_STEP = 4;

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
    }
  }

  addSeatCallback = ({ row, number, id }, addCb) => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        addCb(row, number, id, '');
        this.setState({ loading: false, selected: true, selectedSeat: { row, number, id } });
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
        const entry = {
          id: i * COLUMN_NUM + j,
          number: `$${i}.${j}`,
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
    const { loading, selected, confirmed, selectedSeat, rows } = this.state

    return (
      <div className="seat-picker">
        {!confirmed && (
          <React.Fragment>
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
                <Button variant="success" onClick={this.seatConfirmed}>{`Confirm Selection (${selectedSeat.number})`}</Button>
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
            <span className="seat-confirmed">{`Seat ${selectedSeat.number} Confirmed`}</span>
          </div>
        )}
      </div>
    )
  }
}

export default SeatPickerComponent;