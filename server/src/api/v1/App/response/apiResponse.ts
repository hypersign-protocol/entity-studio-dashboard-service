export default class ApiResponse {
  code: number;
  data: any;
  message: string;

  constructor(code, data, message?) {
    this.code = code;
    this.data = data;
    this.message = message;
  }

  static success(data) {
    return new ApiResponse(200, data);
  }
  static Createdsuccessfully(data) {
    return new ApiResponse(201, data);
  }
  static badRequest(data, msg) {
    return new ApiResponse(400, data, msg);
  }
  static Unauthorized(data, msg) {
    return new ApiResponse(401, data, msg);
  }

  static internal(data, msg) {
    return new ApiResponse(500, data, msg);
  }
}
