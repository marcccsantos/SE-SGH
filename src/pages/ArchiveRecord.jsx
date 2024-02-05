import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ArchiveRecord = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [filterText, setFilterText] = useState('');
  const [selectedColumns, setSelectedColumns] = useState(['name', 'age', 'birth_date']);

  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'archiveRecords'));
      const itemsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(itemsData);
    } catch (error) {
      console.error('Error fetching archived items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
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

  const handleUnarchive = async (itemId) => {
    try {
      const itemRef = doc(db, 'archiveRecords', itemId);
      const itemSnapshot = await getDoc(itemRef);

      if (itemSnapshot.exists()) {
        const itemData = itemSnapshot.data();

        // Add the item back to the "testing2" collection
        const testing2Collection = collection(db, 'testing2');
        await setDoc(doc(testing2Collection), itemData);

        // Delete the item from the archive collection
        await deleteDoc(itemRef);

        // Refresh the archived items
        fetchItems();

        // Log success message to console
        console.log('Record successfully unarchived.');
      } else {
        console.error('Item does not exist in the archive.');
      }
    } catch (error) {
      console.error('Error unarchiving item:', error);
    }
  };

  return (
    <div>
      <h1>Archive Records</h1>
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
              <th>Actions</th>
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
                <td>
                  <button onClick={() => handleUnarchive(item.id)}>Unarchive</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArchiveRecord;
