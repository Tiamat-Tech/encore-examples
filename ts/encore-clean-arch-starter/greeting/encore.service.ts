import { Service } from "encore.dev/service";

// Encore treats this directory and all its subdirectories as the "greeting"
// service. This file is the service's public boundary.
// https://encore.dev/docs/ts/primitives/services
export default new Service("greeting");
