import './App.css';
import FilterPanel from './FilterPanel'
import DataDisplayPanel from './DataDisplayPanel';
import denormalized_movie_data from './data/denormalized_movie_data.json';
import { useState } from 'react';
import { ALL_VALUES, DENORMALIZED_DATA_HEADERS, SLIDER_HEADERS} from './constants';
import 'semantic-ui-css/semantic.min.css';

const App = () => {
  const [lineData, setLineData] = useState(null);

  const processFilterModel = (filterModel) => {
    let filterModelSetVersion = {...filterModel}
    Object.keys(filterModel).forEach(key => {
      if (key !== "year" && key !== "IMDB_rating") {
        filterModelSetVersion[key] = new Set(filterModel[key])
      }
    });
    const checkIfFilterAllowsLine = (line) => {
      const filters = Object.keys(filterModelSetVersion);
      for (let i = 0; i < filters.length; i++ ) {
          if (filterModel[filters[i]] !== ALL_VALUES) {
            if (SLIDER_HEADERS.includes(filters[i])) {
              let min, max;
              [min, max] = filterModelSetVersion[filters[i]]
              if (line[filters[i]] < min || line[filters[i]] > max) {
                  return false;
              }
            } else if (filters[i] === DENORMALIZED_DATA_HEADERS.GENRES) {
              const found = line["genres"].some(r => filterModelSetVersion["genres"].has(r));
              if (!found) return found;
            } else {
                if (!filterModelSetVersion[filters[i]].has(line[filters[i]])) {
                    return false;
                }
            }
          }
      }
      return true;
    }
    const linesToDisplay = denormalized_movie_data.filter(line => checkIfFilterAllowsLine(line));
    setLineData(linesToDisplay);
  }

  return (
    <div className="App">
      <div className="side-panel">
        <FilterPanel processFilterModel={processFilterModel}/>
      </div>
      <div className="data-display">
        {
          !!lineData ? <DataDisplayPanel lineData={lineData}/> : 'Submit filters to view movie text data...'
        }
      </div>
    </div>
  );
}

export default App;
