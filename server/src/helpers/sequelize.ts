import sequelize from "sequelize";

export const seqCurrentDt = () => {
  return sequelize.literal("CURRENT_TIMESTAMP");
  // return sequelize.fn("NOW");
};

export const seqDistanceAttribute = (
  latitude: number,
  longitude: number,
  columnName = "point"
) => {
  var location = sequelize.literal(
    `ST_GeomFromText( 'POINT(${longitude} ${latitude})' )`
  );

  var distance = sequelize.fn(
    "ST_Distance_Sphere",
    sequelize.col(columnName),
    location
  );

  // Sequelize.fn('ST_SetSRID', Sequelize.fn('ST_MakePoint', longitude, latitude), 4326)

  // Sequelize.fn('ST_SetSRID', Sequelize.col('point'), 4326)

  return distance;
};
