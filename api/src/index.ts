import { initApollo } from "./apollo";
import { initMongoose } from "./mongoose";

initMongoose();
const apolloServer = initApollo();
export default apolloServer;
