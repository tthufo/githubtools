import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Download extends React.Component {

    convert() {
        const { data } = this.props;
        var val = []
        for (let i = 0; i < data.length; i++) {
            var temp = {}
            for (let k = 0; k < data[i].length; k++) {
                temp[data[0][k]] = data[i][k]
            }
            if (i !== 0) {
                val.push(temp)
            }
        }
         return val
    }

    render() {
        const { fileName } = this.props;
        const row = this.convert()
        const final = row[0]
        return (
            <ExcelFile hideElement={true} filename={fileName} element={<button>Download Data</button>}>
                <ExcelSheet data={row} name="Github">
                    {
                        row.length !== 0 && Object.keys(final).map(d => 
                            <ExcelColumn key={d} label={d} value={d}/>
                        )
                    }
                </ExcelSheet>
            </ExcelFile>
        );
    }
}

export default Download;

Download.propTypes = {
  
};

Download.defaultProps = {
  
};
