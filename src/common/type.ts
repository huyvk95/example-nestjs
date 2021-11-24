import { Document, Query } from 'mongoose';

export type QueryOneType<SchemaType> = Query<
  (SchemaType & Document<any, any, SchemaType>) | null,
  SchemaType & Document<any, any, SchemaType>,
  // eslint-disable-next-line
  {},
  SchemaType
>;

export type QueryArrType<SchemaType> = Query<
  (SchemaType & Document<any, any, SchemaType>)[],
  SchemaType & Document<any, any, SchemaType>,
  // eslint-disable-next-line
  {},
  SchemaType
>;
