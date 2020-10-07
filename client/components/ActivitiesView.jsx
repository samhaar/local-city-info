import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import Button from "react-bootstrap/Button";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

const mapStateToProps = ({
  informationReducer: { lat, long, countryCode },
}) => ({ lat, long, countryCode });

const ActivitiesView = (props) => {
  const [activitiesData, setActivitiesData] = useState([]);
  const [fetchedData, setFetchedData] = useState(false);
  const [currentActivities, setCurrentActivities] = useState([]); // DISCUSS
  const [favoriteActivities, setFavoriteActivities] = useState([]);

  const countryCode = "US";
  const DEFAULT_IMG =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80";

  const createActivities = (listOfBusinesses) => {
    return listOfBusinesses.map((businessInfo, i) => {
      // console.log("businessInfo: ", businessInfo);
      return (
        <Card key={`activities-card-${i}`} className={"activity-card"}>
          <div className="card-img-container">
            <Card.Img
              className="card-img"
              variant="top"
              src={businessInfo.image_url}
            />
          </div>
          <Card.Body>
            <Card.Title>{businessInfo.name}</Card.Title>
            <Card.Text>Rating: {businessInfo.rating}</Card.Text>
            <Card.Text>Reviews: {businessInfo.review}</Card.Text>
            <Card.Text>Location: {businessInfo.location.address1}</Card.Text>
            {!favoriteActivities.includes(businessInfo) ? (
              <button
                className="favButton"
                onClick={() => {
                  addFav(businessInfo);
                }}
              >
                Add to Favorites
              </button>
            ) : (
              <button
                className="favButton"
                onClick={() => {
                  deleteFav(businessInfo.id);
                }}
              >
                Delete from Favorites
              </button>
            )}
          </Card.Body>
        </Card>
      );
    });
  };

  const fetchData = (category = "bars") => {
    fetch(`/businesses/${category}?lat=${props.lat}&lon=${props.long}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/JSON",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setActivitiesData(data);
        setFetchedData(true);
        setCurrentActivities(createActivities(data));
      })
      .catch((err) => console.log("Activities fetch ERROR: ", err));
  };

  const changeCategory = (category) => {
    return () => fetchData(category);
    // setCurrentActivities(createActivities(activitiesData, category)); // DISCUSS
  };

  const addFav = (info) => {
    console.log("info: ", info);

    if (!favoriteActivities.includes(info)) {
      favoriteActivities.push(info);
      console.log("favoriteActivities: ", favoriteActivities);

      setFavoriteActivities(createActivities(favoriteActivities));
    }
  };

  const deleteFav = (businessId) => {
    console.log("businessId: ", businessId);
    const newFav = [];
    for (let i = 0; i < favoriteActivities.length; i++) {
      if (favoriteActivities[i].id !== businessId) {
        newFav.push(favoriteActivities[i]);
      }
    }
    let newFavs = createActivities(newFav);
    console.log("newFav: ", newFav);
    setFavoriteActivities(newFavs);
  };

  useEffect(() => {
    if (!fetchedData) fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [props.city]);

  if (!activitiesData) return null;

  if (fetchedData) {
    const CATEGORIES = [
      "Restaurants",
      "Bars",
      "Climbing",
      "Health",
      "Bowling",
      "Fitness",
    ];

    const buttonsArray = [];
    for (let i = 0; i < CATEGORIES.length; i += 1) {
      buttonsArray.push(
        <Button
          key={`b${i}`}
          className="mx-1 my-3"
          variant="dark"
          onClick={changeCategory(CATEGORIES[i])}
          id={CATEGORIES[i]}
        >
          {CATEGORIES[i]}
        </Button>
      );
    }

    return (
      <div className="activities-container">
        <h1 id="title">Favorites List</h1>
        <div className="cards-container">
          <CardDeck>{favoriteActivities}</CardDeck>
        </div>
        <h1 id="title">Local Activities Information</h1>
        <div className="activities-buttons">{buttonsArray}</div>
        <div className="cards-container">
          <CardDeck>{currentActivities}</CardDeck>
        </div>
      </div>
    );
  } else {
    return <h1 id="title">Fetching from database</h1>;
  }
};

export default connect(mapStateToProps, null)(ActivitiesView);
