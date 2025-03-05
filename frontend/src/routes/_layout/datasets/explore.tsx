// src/routes/_layout/datasets/explore.tsx
import { Box, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface Dataset {
  id: string;
  name: string;
}

const Explore = (): JSX.Element => {
  const navigate = useNavigate();
  const datasets: Dataset[] = [{ id: "1", name: "Dataset 1" }];

  const handleNavigation = (dataset: Dataset, isTrial: boolean): void => {
    navigate(`/datasets/${dataset.id}`, { state: { isTrial } }); // Fixed TS2345
  };

  return (
    <Box>
      {datasets.map((dataset) => (
        <Button
          key={dataset.id}
          onClick={() => handleNavigation(dataset, true)}
        >
          {dataset.name}
        </Button>
      ))}
    </Box>
  );
};

export default Explore;