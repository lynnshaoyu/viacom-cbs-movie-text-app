# Python script to convert txt files to json files with relevant data
import json 

text_file_dicts = {}
text_file_names = [
    "movie_titles_metadata",
    "movie_characters_metadata",
    "movie_lines",
    "movie_conversations",
]
schemas = [
    ["movie_ID", "movie_title", "year", "IMDB_rating", "IMDB_votes", "genres"],
    ["char_ID", "char_name", "movie_ID", "movie_title", "char_gender", "credits_position"],
    ["line_ID", "char_ID", "movie_ID", "char_name", "text"],
    ["char_ID_1", "char_ID_2", "movie_ID", "line_ID_list"],
]

# Helper function to clean non digit data before numerical type conversion
def strip_non_digit_elems(string):
    output = ""
    for elem in string:
        if elem.isdigit():
            output += elem
    return int(output)

# Turn genres string into list of genres
def split_genre_string(genre_string):
    useless, genre_string_stripped = genre_string.split("[")
    genre_string_clean, useless = genre_string_stripped.split("]\n")
    genre_string_clean = genre_string_clean.replace("'", "")
    arr = genre_string_clean.split(", ");
    return arr

# Clean 4 txt files and conver to json
for i in range(4):
    filename = text_file_names[i] + ".txt"
    schema = schemas[i]
    dict1 = {}
    dict1["data"] = []
  
    with open(filename, encoding = "ISO-8859-1") as fh:
        for line in fh:
  
            arr = line.split(" +++$+++ ")
            row = {}
            for j, elem in enumerate(schema):
                if elem == "credits_position":
                    if arr[j] != "?\n":
                        row[elem] = int(arr[j])
                    else:
                        row[elem] = "?"
                elif elem == "year":
                    row[elem] = int(strip_non_digit_elems(arr[j]))
                elif elem == "IMDB_rating":
                    row[elem] = float(arr[j])
                elif elem == "genres":
                    row[elem] = split_genre_string(arr[j])
                elif elem == "movie_ID":
                    row[elem] = arr[j].replace(" ", "")
                elif elem == "char_ID":
                    row[elem] = arr[j].replace(" ", "")
                else:
                    row[elem] = arr[j]
            dict1["data"].append(row)
    fh.close()
    out_file = open(text_file_names[i] + ".json", "w") 
    json.dump(dict1, out_file) 
    out_file.close()
    
    text_file_dicts[text_file_names[i]] = dict1

# Create filter_data file with all possible values for relevant fields,\
# to be used in filter side panel
filter_data_filename = "filter_data"
filter_data_dict = {}
credit_line_pos = set()
char_name = set()
movie_title = set()
genre = set()
year = set()
IMDB_rating = set()

for char_data in text_file_dicts["movie_characters_metadata"]["data"]:
    if char_data["credits_position"] != "?":
        credit_line_pos.add(char_data["credits_position"])
    if len(char_data["char_name"]) != 0:
        char_name.add(char_data["char_name"])
        
for movie_data in text_file_dicts["movie_titles_metadata"]["data"]:
    if len(movie_data["movie_title"]) != 0:
        movie_title.add(movie_data["movie_title"])
    for elem in movie_data["genres"]:
        if len(elem) != 0:
            genre.add(elem)
    year.add(movie_data["year"])
    IMDB_rating.add(movie_data["IMDB_rating"])
    
filter_data_dict["char_names"] = sorted(list(char_name))
filter_data_dict["credit_line_positions"] = sorted(list(credit_line_pos))
filter_data_dict["credit_line_positions"].append("?")
filter_data_dict["movie_titles"] = sorted(list(movie_title))
filter_data_dict["genres"] = sorted(list(genre))
filter_data_dict["years"] = sorted(list(year))
filter_data_dict["IMDB_ratings"] = sorted(list(IMDB_rating))

out_file = open(filter_data_filename + ".json", "w") 
json.dump(filter_data_dict, out_file) 
out_file.close()

# Create denormalized data set for lines, movies metadata and characters metadata
import pandas as pd
filename = "denormalized_lines_data.json"

movie_data_df = pd.DataFrame.from_records(text_file_dicts["movie_titles_metadata"]["data"])
char_df = pd.DataFrame.from_records(text_file_dicts["movie_characters_metadata"]["data"])
lines_df = pd.DataFrame.from_records(text_file_dicts["movie_lines"]["data"])

del char_df["movie_ID"]
del char_df["movie_title"]
del lines_df["char_name"]
lines_with_char_data_df = lines_df.merge(char_df, on='char_ID', how='left')
denormalized_df = lines_with_char_data_df.merge(movie_data_df, on='movie_ID', how='left')
denormalized_df.to_json('denormalized_movie_data.json',orient='records')