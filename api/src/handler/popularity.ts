import { computePopularity as serviceComputePopularity } from "../service/popularity";

// No validation is necessary for computePopularity so this is purely a passthrough.
export const computePopularity = async () => {
  return serviceComputePopularity();
};
