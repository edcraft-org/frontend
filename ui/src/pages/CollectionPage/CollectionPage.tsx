import { Box, Grid, Button, TextField } from "@mui/material";
import NavBar from "../../components/NavBar/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CollectionPage: React.FC = () => {
  const [collections, setCollections] = useState<string[]>(["CS1101S", "CS2030S", "CS2040S", "CS2109S"]);
  const [newCollection, setNewCollection] = useState<string>("");
  const navigate = useNavigate();

  const addCollection = () => {
    if (newCollection.trim() !== "" && !collections.includes(newCollection)) {
      setCollections([...collections, newCollection]);
      setNewCollection("");
    } else {
      alert("Collection already exists or input is empty.");
    }
  };

  const handleCollectionClick = (collection: string) => {
    navigate(`/collections/${collection}`);
  };

  return (
    <Box sx={{ width: '100%'}}>
      <NavBar/>
      <Box sx={{ marginTop: '64px', padding: 2 }}>
        <Grid container spacing={2} sx={{ margin: '0 auto', maxWidth: '1200px' }}>
          {collections.map((collection, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  height: '150px', // Fixed height for consistency
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => handleCollectionClick(collection)}
              >
                {collection}
              </Box>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                border: '1px dashed #ccc',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '150px', // Fixed height for consistency
                flexDirection: 'column',
              }}
            >
              <Box sx={{ width: '80%' }}>
                <TextField
                  value={newCollection}
                  onChange={(e) => setNewCollection(e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <Button onClick={addCollection} variant="outlined" fullWidth>
                  Add New Collection
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CollectionPage;
