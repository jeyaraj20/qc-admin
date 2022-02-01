import React from 'react';
import Iframe from 'react-iframe'

class PDFViewer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Iframe src={`data:${this.props.notesType};base64,${this.props.data}#toolbar=0`}
                    id="myId"
                    className="myClassname"
                    display="initial"
                    position="relative"
                    width='100%'
                    height={600}
                />
            </>
        );
    }
}

export default PDFViewer;