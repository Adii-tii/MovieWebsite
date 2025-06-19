const Search = ({searchTerm, setSearchTerm}) => {
    return (
        <div className="search">
            <div>
                <img src="./search.svg" alt = "search-icon"></img>

                <input
                type="text"
                placeholder="What's on your mind today?"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>
        </div>
    ) ;
}
 
export default Search;