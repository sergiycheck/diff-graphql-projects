import { gql, useQuery } from '@apollo/client';
import React from 'react';
import styles from './locations.module.css';

type Location = {
  id: string;
  name: string;
  description: string;
  photo: string;
  overallRating: number;
  reviewsForLocation: Review[];
};

type Review = {
  id: string;
  comment: string;
  rating: number;
  location: Location;
};

type get_locations_and_relations_Review = Omit<Review, 'location'>;

type get_locations_and_relations_Location = Omit<
  Location,
  'reviewsForLocation'
> & { reviewsForLocation: get_locations_and_relations_Review[] };

type get_locations_and_relations_type = {
  locations: get_locations_and_relations_Location[];
};

const get_locations_and_relations = gql`
  query Query {
    locations {
      id
      name
      description
      photo
      overallRating
      reviewsForLocation {
        id
        comment
        rating
      }
    }
  }
`;

export default function Locations() {
  const { loading, error, data } = useQuery<get_locations_and_relations_type>(
    get_locations_and_relations
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const renderedLocations = data?.locations.map((item) => (
    <LocationExcerpt key={item.id} location={item} />
  ));

  return <div className={styles.locations}>{renderedLocations}</div>;
}

export function LocationExcerpt({
  location,
}: {
  location: get_locations_and_relations_Location;
}) {
  const { name, description, photo, overallRating, reviewsForLocation } =
    location;

  const renderedReviewForLocation = reviewsForLocation.map((review) => (
    <ReviewExcerpt key={review.id} review={review} />
  ));

  return (
    <React.Fragment>
      <div className={styles.info}>
        <h3>{name}</h3>
        <img
          width="400"
          height="250"
          alt="location-reference"
          src={`${photo}`}
        />
        <br />
        <b>About this location:</b>
        <p>{description}</p>
        <b>rating: {overallRating}</b>
      </div>

      <div className={styles.comments}>
        <p>comments:</p>
        {renderedReviewForLocation}
      </div>
    </React.Fragment>
  );
}

export function ReviewExcerpt({
  review,
}: {
  review: get_locations_and_relations_Review;
}) {
  return (
    <React.Fragment>
      <p>{review.comment}</p>
      <b>rating: {review.rating}</b>
    </React.Fragment>
  );
}
