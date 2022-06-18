import React from 'react';
import { Layout } from '../components';
import { useQuery } from '@apollo/client';
import { QueryResult } from '../components';
import { TRACKS } from './tracks-queries';
import TrackCard from '../containers/track-card';

/**
 * Tracks Page is the Catstronauts home page.
 * We display a grid of tracks fetched with useQuery with the TRACKS query
 */
const Tracks = () => {
  const result = useQuery(TRACKS);

  const renderedTrackCars = result.data?.tracksForHome?.map((track, i) => (
    <TrackCard key={`${track.id}-${i}`} track={track} />
  ));

  return (
    <Layout grid>
      <QueryResult {...result}>{renderedTrackCars}</QueryResult>
    </Layout>
  );
};

export default Tracks;
