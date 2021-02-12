import { useState, useEffect } from 'react';
import { Pagination, Label } from 'semantic-ui-react';
import './DataDisplayPanel.css';

const DataDisplayPanel = ({lineData}) => {
    const [activePgNum, setActivePgNum] = useState(1);
    const [displayItems, setDisplayItems] = useState([]);
    const [pages, setPages] = useState(0);

    const updatePgNum = (e) => {
        setActivePgNum(parseInt(e.target.outerText));
    }

    useEffect(() => {
        setPages(Math.ceil(lineData.length/10));
        const relevantData = lineData.slice((activePgNum-1)*10, (activePgNum-1)*10 + 10);
        setDisplayItems(relevantData.map(line => 
            (   
                <div className="script-item">
                    <div className="text">"{line["text"]}"</div>
                    <div className="info">
                        <span className="char-and-movie-details">-{line["char_name"]}, {line["movie_title"]}, {line["year"]}</span>
                        <span className="imdb-label"><Label icon='star' content={line["IMDB_rating"] + "/10 IMDB"} /></span>
                    </div>
                </div>
        )));
    }, [lineData, activePgNum]);

    return (
        <div className="data-display-panel">
            <Pagination defaultActivePage={activePgNum} onClick={updatePgNum} totalPages={pages} />
            <div className="form-data">
                { displayItems }
            </div>
        </div>
    )
}

export default DataDisplayPanel
