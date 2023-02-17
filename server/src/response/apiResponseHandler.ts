import ApiResponse from './apiResponse';
import { apiResponse } from './apiRespFormat';
export default function apiResponseHandler(data, req, res, next) {
  if (data instanceof ApiResponse) {
    if (data.message === undefined) {
      res.status(data.code).json(apiResponse('success', data.data, false));
    } else {
      res.status(data.code).json(apiResponse(data.message, data.data, true));
    }
    return;
  } else if (data.includes('Orgin')) {
    return res.status(500).json(apiResponse('Origin mismatch or missing', data, true));
  }

  res.status(500).json(apiResponse('something went wrong', data.data, true));
}
