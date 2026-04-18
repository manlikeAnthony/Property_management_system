import { Request, Response } from "express";
import { AppCodes } from "../../errors/AppCodes";
import { HttpCodes } from "../../errors/HttpCodes";
import { getAllLandlords } from '../landlord.controller';


jest.mock("../../services/landlord.service", () => {
  const actual = jest.requireActual("../../services/landlord.service");
  return {
    ...actual,
    becomeLandlordService: jest.mocked(jest.fn()),
    approveLandlordService: jest.mocked(jest.fn()),
    rejectLandlordService: jest.mocked(jest.fn()),
    getAllLandlordsService: jest.mocked(jest.fn()),
    getAllApprovedLandlordsService: jest.mocked(jest.fn()),
    getAllLandlordApplicationsService: jest.mocked(jest.fn()),
    getMyLandlordProfileService: jest.mocked(jest.fn()),
    getAllRejectedLandlordsService: jest.mocked(jest.fn()),
    getSingleLandlordService: jest.mocked(jest.fn()),
    deleteLandlordService: jest.mocked(jest.fn()),
    __esModule: true,
  };
});

jest.mock("../../response", () => {
  const actual = jest.requireActual("../../response");
  return {
    ...actual,
    successResponse: jest.mocked(jest.fn()),
    __esModule: true,
  };
});

jest.mock("../../utils", () => {
  const actual = jest.requireActual("../../utils");
  return {
    ...actual,
    checkPermissions: jest.mocked(jest.fn()),
    __esModule: true,
  };
});


describe('getAllLandlords() getAllLandlords method', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();

    mockReq = {
      query: {},
    };

    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
    jest.clearAllMocks();
  });


  it('should retrieve landlords successfully with default query', async () => {

    const landlordsArray = [
      {
        _id: 'landlord1',
        name: 'John Doe',
        email: 'john@example.com',
        roles: ['LANDLORD'],
        status: 'ACTIVE',
      },
      {
        _id: 'landlord2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        roles: ['LANDLORD'],
        status: 'ACTIVE',
      },
    ] as any;

    const { parseLandlordQuery } = require("../../query/landlord/landlordQuery");
    parseLandlordQuery.mockReturnValue({});

    const { getAllLandlordsService } = require("../../services/landlord.service");
    getAllLandlordsService.mockResolvedValue(landlordsArray as any);

    const { successResponse } = require("../../response");
    const expectedResponse = {
      success: true,
      message: 'Landlords retrieved successfully',
      data: landlordsArray,
      code: AppCodes.LANDLORDS_RETRIEVED,
    };
    successResponse.mockReturnValue(expectedResponse as any);

    await getAllLandlords(mockReq as any, mockRes as any);

    expect(parseLandlordQuery).toHaveBeenCalledWith(mockReq.query);
    expect(getAllLandlordsService).toHaveBeenCalledWith({});
    expect(successResponse).toHaveBeenCalledWith({
      message: 'Landlords retrieved successfully',
      data: landlordsArray,
      code: AppCodes.LANDLORDS_RETRIEVED,
    });
    expect(statusMock).toHaveBeenCalledWith(HttpCodes.OK);
    expect(jsonMock).toHaveBeenCalledWith(expectedResponse);
  });

  it('should pass query parameters to parseLandlordQuery and getAllLandlordsService', async () => {

    mockReq.query = { status: 'ACTIVE', page: '2', limit: '10' };

    const parsedQuery = { status: 'ACTIVE', page: 2, limit: 10 };
    const landlordsArray = [
      {
        _id: 'landlord3',
        name: 'Alice',
        email: 'alice@example.com',
        roles: ['LANDLORD'],
        status: 'ACTIVE',
      },
    ] as any;

    const { parseLandlordQuery } = require("../../query/landlord/landlordQuery");
    parseLandlordQuery.mockReturnValue(parsedQuery as any);

    const { getAllLandlordsService } = require("../../services/landlord.service");
    getAllLandlordsService.mockResolvedValue(landlordsArray as any);

    const { successResponse } = require("../../response");
    const expectedResponse = {
      success: true,
      message: 'Landlords retrieved successfully',
      data: landlordsArray,
      code: AppCodes.LANDLORDS_RETRIEVED,
    };
    successResponse.mockReturnValue(expectedResponse as any);

    await getAllLandlords(mockReq as any, mockRes as any);

    expect(parseLandlordQuery).toHaveBeenCalledWith(mockReq.query);
    expect(getAllLandlordsService).toHaveBeenCalledWith(parsedQuery);
    expect(successResponse).toHaveBeenCalledWith({
      message: 'Landlords retrieved successfully',
      data: landlordsArray,
      code: AppCodes.LANDLORDS_RETRIEVED,
    });
    expect(statusMock).toHaveBeenCalledWith(HttpCodes.OK);
    expect(jsonMock).toHaveBeenCalledWith(expectedResponse);
  });


  it('should handle empty landlords array', async () => {

    const { parseLandlordQuery } = require("../../query/landlord/landlordQuery");
    parseLandlordQuery.mockReturnValue({} as any);

    const { getAllLandlordsService } = require("../../services/landlord.service");
    getAllLandlordsService.mockResolvedValue([] as any);

    const { successResponse } = require("../../response");
    const expectedResponse = {
      success: true,
      message: 'Landlords retrieved successfully',
      data: [],
      code: AppCodes.LANDLORDS_RETRIEVED,
    };
    successResponse.mockReturnValue(expectedResponse as any);

    await getAllLandlords(mockReq as any, mockRes as any);

    expect(parseLandlordQuery).toHaveBeenCalledWith(mockReq.query);
    expect(getAllLandlordsService).toHaveBeenCalledWith({});
    expect(successResponse).toHaveBeenCalledWith({
      message: 'Landlords retrieved successfully',
      data: [],
      code: AppCodes.LANDLORDS_RETRIEVED,
    });
    expect(statusMock).toHaveBeenCalledWith(HttpCodes.OK);
    expect(jsonMock).toHaveBeenCalledWith(expectedResponse);
  });

  it('should handle landlords with missing optional fields', async () => {

    const landlordsArray = [
      {
        _id: 'landlord4',
        name: 'Bob',
        email: 'bob@example.com',
        roles: ['LANDLORD'],
        // status is missing
      },
    ] as any;

    const { parseLandlordQuery } = require("../../query/landlord/landlordQuery");
    parseLandlordQuery.mockReturnValue({} as any);

    const { getAllLandlordsService } = require("../../services/landlord.service");
    getAllLandlordsService.mockResolvedValue(landlordsArray as any);

    const { successResponse } = require("../../response");
    const expectedResponse = {
      success: true,
      message: 'Landlords retrieved successfully',
      data: landlordsArray,
      code: AppCodes.LANDLORDS_RETRIEVED,
    };
    successResponse.mockReturnValue(expectedResponse as any);

    await getAllLandlords(mockReq as any, mockRes as any);

    expect(parseLandlordQuery).toHaveBeenCalledWith(mockReq.query);
    expect(getAllLandlordsService).toHaveBeenCalledWith({});
    expect(successResponse).toHaveBeenCalledWith({
      message: 'Landlords retrieved successfully',
      data: landlordsArray,
      code: AppCodes.LANDLORDS_RETRIEVED,
    });
    expect(statusMock).toHaveBeenCalledWith(HttpCodes.OK);
    expect(jsonMock).toHaveBeenCalledWith(expectedResponse);
  });

  it('should propagate error if getAllLandlordsService throws', async () => {

    const { parseLandlordQuery } = require("../../query/landlord/landlordQuery");
    parseLandlordQuery.mockReturnValue({} as any);

    const { getAllLandlordsService } = require("../../services/landlord.service");
    const error = new Error('Database failure');
    getAllLandlordsService.mockRejectedValue(error as never);

    await expect(getAllLandlords(mockReq as any, mockRes as any)).rejects.toThrow('Database failure');
    expect(parseLandlordQuery).toHaveBeenCalledWith(mockReq.query);
    expect(getAllLandlordsService).toHaveBeenCalledWith({});
    const { successResponse } = require("../../response");
    expect(successResponse).not.toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
  });

  it('should propagate error if parseLandlordQuery throws', async () => {

    const { parseLandlordQuery } = require("../../query/landlord/landlordQuery");
    const error = new Error('Invalid query');
    parseLandlordQuery.mockImplementation(() => {
      throw error;
    });

    await expect(getAllLandlords(mockReq as any, mockRes as any)).rejects.toThrow('Invalid query');
    expect(parseLandlordQuery).toHaveBeenCalledWith(mockReq.query);
    const { getAllLandlordsService } = require("../../services/landlord.service");
    expect(getAllLandlordsService).not.toHaveBeenCalled();
    const { successResponse } = require("../../response");
    expect(successResponse).not.toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
  });
});