import { AppCodes } from "../../errors/AppCodes";
import { HttpCodes } from "../../errors/HttpCodes";
import { getOwnershipHistoryService } from '../ownership.service';

interface MockOwnership {
  property: any;
  owner: any;
  acquiredAt: Date;
  disposedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}



class MockObjectId {
  private id: string;
  constructor(id: string) {
    this.id = id;
  }
  toString() {
    return this.id;
  }
}

const mockFindOne = jest.fn();
const mockFind = jest.fn();

jest.mock("../../models/ownership.model", () => ({
  __esModule: true,
  default: {
    findOne: jest.mocked(mockFindOne),
    find: jest.mocked(mockFind),
  },
}));

jest.mock("../../models/property.model", () => ({
  __esModule: true,
  default: {},
}));

jest.mock("../../models/transaction.model", () => ({
  __esModule: true,
  default: {},
}));

const mockCheckPermissions = jest.fn();
jest.mock("../../utils/checkPermission", () => {
  const actual = jest.requireActual("../../utils/checkPermission");
  return {
    ...actual,
    checkPermissions: jest.mocked(mockCheckPermissions),
  };
});

const mockThrowError = jest.fn();
jest.mock("../../errors/CustomError", () => ({
  __esModule: true,
  CustomError: {
    throwError: jest.mocked(mockThrowError),
  },
}));

jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  return {
    ...actual,
    Types: {
      ...actual.Types,
      ObjectId: MockObjectId,
    },
  };
});

describe('getOwnershipHistoryService() getOwnershipHistoryService method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('should return ownership history for ADMIN user even if there is no current owner', async () => {
    const propertyId = 'property123';
    const requestUser = {
      userId: 'admin1',
      roles: ['ADMIN'],
      name: 'Admin User',
    };

    mockFindOne.mockResolvedValueOnce(null as any);

    const ownershipHistory: MockOwnership[] = [
      {
        property: propertyId,
        owner: { name: 'Owner1', email: 'owner1@email.com' },
        acquiredAt: new Date('2020-01-01'),
        disposedAt: new Date('2021-01-01'),
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2021-01-01'),
      },
      {
        property: propertyId,
        owner: { name: 'Owner2', email: 'owner2@email.com' },
        acquiredAt: new Date('2021-01-02'),
        disposedAt: null,
        createdAt: new Date('2021-01-02'),
        updatedAt: new Date('2022-01-01'),
      },
    ];

    const mockSort = jest.fn().mockReturnThis();
    const mockPopulate = jest.fn().mockResolvedValueOnce(ownershipHistory as any);

    mockFind.mockReturnValueOnce({
      sort: mockSort,
      populate: mockPopulate,
    } as any);

    const result = await getOwnershipHistoryService(propertyId, requestUser as any);

    expect(mockFindOne).toHaveBeenCalledWith({
      property: propertyId,
      disposedAt: null,
    });
    expect(mockFind).toHaveBeenCalledWith({
      property: propertyId,
    });
    expect(mockSort).toHaveBeenCalledWith({ acquiredAt: -1 });
    expect(mockPopulate).toHaveBeenCalledWith({ path: 'owner', select: 'name email' });
    expect(result).toBe(ownershipHistory as any);
    expect(mockCheckPermissions).not.toHaveBeenCalled();
    expect(mockThrowError).not.toHaveBeenCalled();
  });

  it('should return ownership history for non-ADMIN user with current ownership and permission', async () => {
    const propertyId = 'property456';
    const ownerId = new MockObjectId('owner123');
    const requestUser = {
      userId: 'owner123',
      roles: ['USER'],
      name: 'Owner User',
    };

    const currentOwner: MockOwnership = {
      property: propertyId,
      owner: ownerId,
      acquiredAt: new Date('2022-01-01'),
      disposedAt: null,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2022-01-01'),
    };
    mockFindOne.mockResolvedValueOnce(currentOwner as any);

    const ownershipHistory: MockOwnership[] = [
      {
        property: propertyId,
        owner: { name: 'Owner1', email: 'owner1@email.com' },
        acquiredAt: new Date('2020-01-01'),
        disposedAt: new Date('2021-01-01'),
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2021-01-01'),
      },
      {
        property: propertyId,
        owner: { name: 'Owner2', email: 'owner2@email.com' },
        acquiredAt: new Date('2021-01-02'),
        disposedAt: null,
        createdAt: new Date('2021-01-02'),
        updatedAt: new Date('2022-01-01'),
      },
    ];

    const mockSort = jest.fn().mockReturnThis();
    const mockPopulate = jest.fn().mockResolvedValueOnce(ownershipHistory as any);

    mockFind.mockReturnValueOnce({
      sort: mockSort,
      populate: mockPopulate,
    } as any);

    const result = await getOwnershipHistoryService(propertyId, requestUser as any);

    expect(mockFindOne).toHaveBeenCalledWith({
      property: propertyId,
      disposedAt: null,
    });
    expect(mockCheckPermissions).toHaveBeenCalledWith(requestUser as any, ownerId as any);
    expect(mockFind).toHaveBeenCalledWith({
      property: propertyId,
    });
    expect(mockSort).toHaveBeenCalledWith({ acquiredAt: -1 });
    expect(mockPopulate).toHaveBeenCalledWith({ path: 'owner', select: 'name email' });
    expect(result).toBe(ownershipHistory as any);
    expect(mockThrowError).not.toHaveBeenCalled();
  });


  it('should throw FORBIDDEN if non-ADMIN user and no current owner', async () => {
    const propertyId = 'property789';
    const requestUser = {
      userId: 'user789',
      roles: ['USER'],
      name: 'User789',
    };

    mockFindOne.mockResolvedValueOnce(null as any);

    mockThrowError.mockImplementation(() => {
      throw new Error('FORBIDDEN');
    });

    await expect(getOwnershipHistoryService(propertyId, requestUser as any)).rejects.toThrow('FORBIDDEN');

    expect(mockFindOne).toHaveBeenCalledWith({
      property: propertyId,
      disposedAt: null,
    });
    expect(mockThrowError).toHaveBeenCalledWith(
      HttpCodes.FORBIDDEN,
      AppCodes.AUTH_UNAUTHORIZED,
      'No active ownership — access denied',
    );
    expect(mockCheckPermissions).not.toHaveBeenCalled();
    expect(mockFind).not.toHaveBeenCalled();
  });

  it('should throw NOT_FOUND if ownership history is empty', async () => {
    const propertyId = 'property999';
    const ownerId = new MockObjectId('owner999');
    const requestUser = {
      userId: 'owner999',
      roles: ['USER'],
      name: 'Owner999',
    };

    const currentOwner: MockOwnership = {
      property: propertyId,
      owner: ownerId,
      acquiredAt: new Date('2022-01-01'),
      disposedAt: null,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2022-01-01'),
    };
    mockFindOne.mockResolvedValueOnce(currentOwner as any);

    const mockSort = jest.fn().mockReturnThis();
    const mockPopulate = jest.fn().mockResolvedValueOnce([] as any);

    mockFind.mockReturnValueOnce({
      sort: mockSort,
      populate: mockPopulate,
    } as any);

    mockThrowError.mockImplementation(() => {
      throw new Error('NOT_FOUND');
    });

    await expect(getOwnershipHistoryService(propertyId, requestUser as any)).rejects.toThrow('NOT_FOUND');

    expect(mockFindOne).toHaveBeenCalledWith({
      property: propertyId,
      disposedAt: null,
    });
    expect(mockCheckPermissions).toHaveBeenCalledWith(requestUser as any, ownerId as any);
    expect(mockFind).toHaveBeenCalledWith({
      property: propertyId,
    });
    expect(mockSort).toHaveBeenCalledWith({ acquiredAt: -1 });
    expect(mockPopulate).toHaveBeenCalledWith({ path: 'owner', select: 'name email' });
    expect(mockThrowError).toHaveBeenCalledWith(
      HttpCodes.NOT_FOUND,
      AppCodes.OWNERSHIP_NOT_FOUND,
      'No ownership history found for this property',
    );
  });

  it('should propagate errors thrown by Ownership.findOne', async () => {
    const propertyId = 'propertyError1';
    const requestUser = {
      userId: 'userError1',
      roles: ['ADMIN'],
      name: 'Admin',
    };

    mockFindOne.mockRejectedValueOnce(new Error('DB error'));

    await expect(getOwnershipHistoryService(propertyId, requestUser as any)).rejects.toThrow('DB error');
    expect(mockFindOne).toHaveBeenCalledWith({
      property: propertyId,
      disposedAt: null,
    });
    expect(mockFind).not.toHaveBeenCalled();
    expect(mockThrowError).not.toHaveBeenCalled();
  });

  it('should propagate errors thrown by Ownership.find', async () => {
    const propertyId = 'propertyError2';
    const requestUser = {
      userId: 'admin2',
      roles: ['ADMIN'],
      name: 'Admin2',
    };

    mockFindOne.mockResolvedValueOnce(null as any);

    mockFind.mockImplementationOnce(() => {
      throw new Error('Find error');
    });

    await expect(getOwnershipHistoryService(propertyId, requestUser as any)).rejects.toThrow('Find error');
    expect(mockFindOne).toHaveBeenCalledWith({
      property: propertyId,
      disposedAt: null,
    });
    expect(mockFind).toHaveBeenCalledWith({
      property: propertyId,
    });
    expect(mockThrowError).not.toHaveBeenCalled();
  });

  it('should propagate errors thrown by checkPermissions', async () => {
    const propertyId = 'propertyError3';
    const ownerId = new MockObjectId('ownerError3');
    const requestUser = {
      userId: 'userError3',
      roles: ['USER'],
      name: 'UserError3',
    };

    const currentOwner: MockOwnership = {
      property: propertyId,
      owner: ownerId,
      acquiredAt: new Date('2022-01-01'),
      disposedAt: null,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2022-01-01'),
    };
    mockFindOne.mockResolvedValueOnce(currentOwner as any);

    mockCheckPermissions.mockImplementationOnce(() => {
      throw new Error('Permission denied');
    });

    await expect(getOwnershipHistoryService(propertyId, requestUser as any)).rejects.toThrow('Permission denied');
    expect(mockFindOne).toHaveBeenCalledWith({
      property: propertyId,
      disposedAt: null,
    });
    expect(mockCheckPermissions).toHaveBeenCalledWith(requestUser as any, ownerId as any);
    expect(mockFind).not.toHaveBeenCalled();
    expect(mockThrowError).not.toHaveBeenCalled();
  });

  it('should handle ownership history with only one record', async () => {
    const propertyId = 'propertySingle';
    const ownerId = new MockObjectId('ownerSingle');
    const requestUser = {
      userId: 'ownerSingle',
      roles: ['USER'],
      name: 'OwnerSingle',
    };

    const currentOwner: MockOwnership = {
      property: propertyId,
      owner: ownerId,
      acquiredAt: new Date('2022-01-01'),
      disposedAt: null,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2022-01-01'),
    };
    mockFindOne.mockResolvedValueOnce(currentOwner as any);

    const ownershipHistory: MockOwnership[] = [
      {
        property: propertyId,
        owner: { name: 'OwnerSingle', email: 'single@email.com' },
        acquiredAt: new Date('2022-01-01'),
        disposedAt: null,
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2022-01-01'),
      },
    ];

    const mockSort = jest.fn().mockReturnThis();
    const mockPopulate = jest.fn().mockResolvedValueOnce(ownershipHistory as any);

    mockFind.mockReturnValueOnce({
      sort: mockSort,
      populate: mockPopulate,
    } as any);

    const result = await getOwnershipHistoryService(propertyId, requestUser as any);

    expect(mockFindOne).toHaveBeenCalledWith({
      property: propertyId,
      disposedAt: null,
    });
    expect(mockCheckPermissions).toHaveBeenCalledWith(requestUser as any, ownerId as any);
    expect(mockFind).toHaveBeenCalledWith({
      property: propertyId,
    });
    expect(mockSort).toHaveBeenCalledWith({ acquiredAt: -1 });
    expect(mockPopulate).toHaveBeenCalledWith({ path: 'owner', select: 'name email' });
    expect(result).toBe(ownershipHistory as any);
    expect(mockThrowError).not.toHaveBeenCalled();
  });

  it('should work if user has multiple roles including ADMIN', async () => {
    const propertyId = 'propertyMultiRole';
    const requestUser = {
      userId: 'adminMulti',
      roles: ['USER', 'ADMIN', 'LANDLORD'],
      name: 'MultiRole Admin',
    };

    mockFindOne.mockResolvedValueOnce(null as any);

    const ownershipHistory: MockOwnership[] = [
      {
        property: propertyId,
        owner: { name: 'OwnerMulti', email: 'multi@email.com' },
        acquiredAt: new Date('2022-01-01'),
        disposedAt: null,
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2022-01-01'),
      },
    ];

    const mockSort = jest.fn().mockReturnThis();
    const mockPopulate = jest.fn().mockResolvedValueOnce(ownershipHistory as any);

    mockFind.mockReturnValueOnce({
      sort: mockSort,
      populate: mockPopulate,
    } as any);

    const result = await getOwnershipHistoryService(propertyId, requestUser as any);

    expect(mockFindOne).toHaveBeenCalledWith({
      property: propertyId,
      disposedAt: null,
    });
    expect(mockFind).toHaveBeenCalledWith({
      property: propertyId,
    });
    expect(mockSort).toHaveBeenCalledWith({ acquiredAt: -1 });
    expect(mockPopulate).toHaveBeenCalledWith({ path: 'owner', select: 'name email' });
    expect(result).toBe(ownershipHistory as any);
    expect(mockCheckPermissions).not.toHaveBeenCalled();
    expect(mockThrowError).not.toHaveBeenCalled();
  });
});