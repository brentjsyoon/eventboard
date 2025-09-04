import React, { useState } from "react";
import Button from "../Button";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
}


const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {

    const [query, setQuery] = useState("");
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <section className={styles.searchBar}>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    placeholder="Search for events..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        onSearch(e.target.value);
                    }}
                />
                <Button variant="primary" size="sm">
                    Search
                </Button>
            </form>
        </section>
    );
};

export default SearchBar;