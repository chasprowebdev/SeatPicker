import React from 'react'
import SeatPicker from 'react-seat-picker';

const ROW_NUM = 8;
const COLUMN_NUM = 8;
const ROW_STEP = 4;
const COLUMN_STEP = 4;

class SeatPickerComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
    }
  }

  addSeatCallback = ({ row, number, id }, addCb) => {
    this.setState(
      {
        loading: true
      },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log(`Added seat ${number}, row ${row}, id ${id}`);
        const newTooltip = `tooltip for id-${id} added by callback`;
        addCb(row, number, id, newTooltip);
        this.setState({ loading: false });
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
          await new Promise(resolve => setTimeout(resolve, 750));
          console.log(
            `Removed seat ${params.number}, row ${params.row}, id ${params.id}`
          );
          removeCb(params.row, params.number);
        }
        await new Promise(resolve => setTimeout(resolve, 750));
        console.log(`Added seat ${number}, row ${row}, id ${id}`);
        const newTooltip = `tooltip for id-${id} added by callback`;
        addCb(row, number, id, newTooltip);
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
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log(`Removed seat ${number}, row ${row}, id ${id}`);
        // A value of null will reset the tooltip to the original while '' will hide the tooltip
        const newTooltip = ["A", "B", "C"].includes(row) ? null : "";
        removeCb(row, number, newTooltip);
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
          isSelected: true,
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

  render() {
    let rows = this.generateSeatMap()
    const { loading } = this.state

    return (
      <div className="seat-picker">
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
      </div>
    )
  }
}

export default SeatPickerComponent;