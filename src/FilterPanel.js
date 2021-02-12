import filter_data from './data/filter_data.json';
import './FilterPanel.css';
import { Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { Slider } from "react-semantic-ui-range";
import { useState } from 'react';
import { DENORMALIZED_DATA_HEADERS, PLACEHOLDER_TO_DATA_HEADER_MAP, ALL_VALUES, INITIAL_FILTER_MODEL} from './constants';

const FilterPanel = ({ processFilterModel }) => {
    const yearsMin = filter_data["years"][0];
    const yearsMax = filter_data["years"][filter_data["years"].length-1];
    const minRating = filter_data["IMDB_ratings"][0];
    const maxRating = filter_data["IMDB_ratings"][filter_data["IMDB_ratings"].length-1];
    const creditLineMin = filter_data["credit_line_positions"][0];
    const creditLineMax = filter_data["credit_line_positions"][filter_data["credit_line_positions"].length-2];

    const [femalesChecked, setFemalesChecked] = useState(true);
    const [malesChecked, setMalesChecked] = useState(true);
    const [genderUnknownsChecked, setGenderUnknownsChecked] = useState(true);
    const [yearsMinMax, setYearsMinMax] = useState([yearsMin, yearsMax]);
    const [ratingMinMax, setRatingMinMax] = useState([minRating, maxRating]);
    const [creditLineMinMax, setCreditLineMinMax] = useState([creditLineMin, creditLineMax]);
    const [creditLineUnknownChecked, setCreditLineUnknownChecked] = useState(true);
    const [selectedNames, setSelectedNames] = useState([ALL_VALUES]);
    const [selectedMovies, setSelectedMovies] = useState([ALL_VALUES]);
    const [selectedGenres, setSelectedGenres] = useState([ALL_VALUES]);
    const placeholderToSetFnMap = {
        "Name": setSelectedNames,
        "Movie Title": setSelectedMovies,
        "Genre": setSelectedGenres,
    }
    const placeholderToSelectedMap = {
        "Name": selectedNames,
        "Movie Title": selectedMovies,
        "Genre": selectedGenres,
    };
    const characterNames = [{
        key: ALL_VALUES, text: ALL_VALUES, value: ALL_VALUES
    }, ...filter_data["char_names"].map(name => ({
        key: name, text: name, value: name
    }))];
    const movieTitles = [{
        key: ALL_VALUES, text: ALL_VALUES, value: ALL_VALUES
    }, ...filter_data["movie_titles"].map(title => ({
        key: title, text: title, value: title
    }))];
    const genres = [{
        key: ALL_VALUES, text: ALL_VALUES, value: ALL_VALUES
    }, ...filter_data["genres"].map(genre => ({
        key: genre, text: genre, value: genre
    }))];
    const [filterModel, setFilterModel] = useState(INITIAL_FILTER_MODEL);
    const yearsSliderInfo = {
        start: yearsMinMax,
        min: yearsMin,
        max: yearsMax,
        step: 1,
        onChange: value => {
            setYearsMinMax(value);
            setFilterModel({...filterModel, [DENORMALIZED_DATA_HEADERS.YEAR] : value});
          }
    };
    const ratingsSliderInfo = {
        start: ratingMinMax,
        min: minRating,
        max: maxRating,
        step: 1,
        onChange: value => {
            setRatingMinMax(value);
            setFilterModel({...filterModel, [DENORMALIZED_DATA_HEADERS.IMDB_RATING]: value});
          }
    };
    const creditLinePosInfo = {
        start: creditLineMinMax,
        min: creditLineMin,
        max: creditLineMax,
        step: 1,
        onChange: value => {
            setCreditLineMinMax(value);
            setFilterModel({...filterModel, [DENORMALIZED_DATA_HEADERS.CREDIT_LINE_POS]: {
                minMax: value,
                creditLineUnknownChecked: creditLineUnknownChecked
            }});
          }
    };

    const submitFilterModel = () => {
        processFilterModel(filterModel);
    }

    const modifyFilterModelForGender = (genderValue) => {
        const currentFilterElem = filterModel[DENORMALIZED_DATA_HEADERS.GENDER]
        if (currentFilterElem.includes(genderValue)) {
            setFilterModel({...filterModel, [DENORMALIZED_DATA_HEADERS.GENDER]: currentFilterElem.filter(x => x !== genderValue)})
        } else {
            setFilterModel({...filterModel, [DENORMALIZED_DATA_HEADERS.GENDER]: [...currentFilterElem, genderValue]})
        }
    }

    const check = (e) => {
        if (e.target.value === "f") {
            setFemalesChecked(!femalesChecked);
        } else if (e.target.value === "m") {
            setMalesChecked(!malesChecked);
        } else {
            setGenderUnknownsChecked(!genderUnknownsChecked);
        }
        modifyFilterModelForGender(e.target.value);
    }

    const checkCreditLineUnknown = (e) => {
        setCreditLineUnknownChecked(!creditLineUnknownChecked);
        setFilterModel({...filterModel, [DENORMALIZED_DATA_HEADERS.CREDIT_LINE_POS]: {
            minMax: creditLineMinMax,
            creditLineUnknownChecked: creditLineUnknownChecked
        }});
    }

    const modifyFilterModel = (event, data ) => {
        const newFilterModel = {...filterModel};
        const currentSelect = placeholderToSelectedMap[data.placeholder];
        if (!currentSelect.includes(ALL_VALUES) && data.value.includes(ALL_VALUES)) {
            newFilterModel[PLACEHOLDER_TO_DATA_HEADER_MAP[data.placeholder]] = ALL_VALUES;
            const setFn = placeholderToSetFnMap[data.placeholder];
            setFn([ALL_VALUES]);
        } else if (currentSelect.includes(ALL_VALUES) && data.value.length > 1) {
            const newValues = data.value.filter(x => x !== ALL_VALUES);
            newFilterModel[PLACEHOLDER_TO_DATA_HEADER_MAP[data.placeholder]] = newValues;
            const setFn = placeholderToSetFnMap[data.placeholder];
            setFn(newValues);
        } else {
            newFilterModel[PLACEHOLDER_TO_DATA_HEADER_MAP[data.placeholder]] = data.value;
            const setFn = placeholderToSetFnMap[data.placeholder];
            setFn(data.value);
        }
        setFilterModel(newFilterModel);
    }

    return (
        <div class="filter-panel"> 
            <h1>Filter Movie Text Data</h1>
            <h2>Character Filters</h2>
            <h3>Character Gender</h3>
                <form className="checkbox-section">
                    <input type="checkbox" checked={femalesChecked} name="female_checkbox" value="f" onChange={check}>
                    </input>
                    <label for="female_checkbox"> Female</label>
                    <input type="checkbox" checked={malesChecked} name="male_checkbox" value="m" onChange={check}></input>
                    <label for="male_checkbox"> Male</label>
                    <input type="checkbox" checked={genderUnknownsChecked} name="unknown_checkbox" value="?" onChange={check}></input>
                    <label for="unknown_checkbox"> Unknown</label>
                </form>
            <h3>Character Name</h3>
                <Dropdown
                    placeholder='Name'
                    fluid
                    multiple
                    search
                    selection
                    options={characterNames}
                    onChange={modifyFilterModel}
                    value={ selectedNames }
                />
             <div class="filter-section"> 
                <h3>Character Credit Line Position</h3>
                <Slider value={creditLineMinMax} multiple color="blue" settings={creditLinePosInfo} />
                <div className="labels">
                    <span class="left-label"> {creditLineMinMax[0]} </span>
                    <span class="right-label"> {creditLineMinMax[1]} </span>
                </div>
                <form className="checkbox-section">
                    <input type="checkbox" checked={creditLineUnknownChecked} name="unknown_cred_checkbox" value="?" onChange={checkCreditLineUnknown}>
                    </input>
                    <label for="unknown_cred_checkbox"> Include Unknown Credit Line Positions</label>
                </form>
            </div>
            <br></br>
            <h2>Movie Filters</h2>
            <h3>Movie Title</h3>
                <Dropdown
                    placeholder='Movie Title'
                    fluid
                    multiple
                    search
                    selection
                    options={movieTitles}
                    onChange={modifyFilterModel}
                    value={ selectedMovies }
                />
            <h3>Genre</h3>
                <Dropdown
                    placeholder='Genre'
                    fluid
                    multiple
                    search
                    selection
                    options={genres}
                    onChange={modifyFilterModel}
                    value={ selectedGenres }
                />
            <div class="filter-section"> 
                <h3>Years of Release</h3>
                    <Slider value={yearsMinMax} multiple color="blue" settings={yearsSliderInfo} />
                    <div className="labels">
                        <span class="left-label"> {yearsMinMax[0]} </span>
                        <span class="right-label"> {yearsMinMax[1]} </span>
                    </div>
            </div>
            <div class="filter-section">
                <h3>IMDB Rating</h3>
                    <Slider value={ratingMinMax} multiple color="blue" settings={ratingsSliderInfo} />
                    <div className="labels">
                        <span class="left-label"> {ratingMinMax[0]} </span>
                        <span class="right-label"> {ratingMinMax[1]} </span>
                    </div>
            </div>
            <button class="ui button" id="button" onClick={submitFilterModel}> Apply Filters</button>
        </div>
    )
}

export default FilterPanel;