import React from "react";
import Button from "../Button";
import styles from "./SearchBar.module.css";

const SearchBar: React.FC = () => {
    
    return (
        <section className={styles.searchBar}>
            <input type="text" placeholder="Search for events..." />
            <Button variant="primary" size="sm">Search</Button>
        </section>
    );

};

export default SearchBar;