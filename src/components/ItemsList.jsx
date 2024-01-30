// src/components/ItemsList.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db from '../firebase';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [filterText, setFilterText] = useState('');
  const [selectedColumns, setSelectedColumns] = useState(['name', 'age', 'birth_date']);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'testing2'));
        const itemsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setItems(itemsData);
      } catch (error) {
        console.error('Error fetching items: ', error);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    // Filter and sort items based on filterText and sortBy
    const filteredAndSorted = items
      .filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(filterText.toLowerCase());
        const ageMatch = item.age.toString().toLowerCase().includes(filterText.toLowerCase());
        const birthDateMatch = item.birth_date.toDate().toLocaleDateString().toLowerCase().includes(filterText.toLowerCase());

        return nameMatch || ageMatch || birthDateMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortBy === 'age') {
          return a.age - b.age;
        } else if (sortBy === 'birth_date') {
          return a.birth_date.toMillis() - b.birth_date.toMillis();
        }
        return 0; // Default sorting
      });

    setFilteredItems(filteredAndSorted);
  }, [filterText, sortBy, items]);

  const handleColumnToggle = (column) => {
    const updatedColumns = selectedColumns.includes(column)
      ? selectedColumns.filter((col) => col !== column)
      : [...selectedColumns, column];

    setSelectedColumns(updatedColumns);
  };

  return (
    <div>
      <h1>Firestore Collection</h1>
      {/* Filter and Sort Controls */}
      <label>
        Search:
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </label>
      <br />
      <label>
        Sort By:
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="default">Default</option>
          <option value="name">Name</option>
          <option value="age">Age</option>
          <option value="birth_date">Birth Date</option>
        </select>
      </label>

      {/* Column Selection Checkboxes */}
      <div>
        <h2>Select Columns:</h2>
        {['name', 'age', 'birth_date'].map((column) => (
          <label key={column}>
            <input
              type="checkbox"
              value={column}
              checked={selectedColumns.includes(column)}
              onChange={() => handleColumnToggle(column)}
            />
            {column}
          </label>
        ))}
      </div>

      {/* Display Content */}
      <div>
        <h2>Filtered and Sorted Content</h2>
        <table>
          <thead>
            <tr>
              {selectedColumns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
            <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                {selectedColumns.map((column) => (
                  <td key={column}>
                    {column === 'birth_date' ? item[column].toDate().toLocaleDateString() : item[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemsList;
