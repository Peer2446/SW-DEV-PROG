export const validateHotel = (
  name: string,
  address: string,
  district: string,
  province: string,
  postalcode: string,
  tel: string,
  region: string,
  starterPrice: number,
  amenities: string[],
  roomType: { type: string; price: number }[]
): boolean => {
  const requiredFields = [
    name,
    address,
    district,
    province,
    postalcode,
    tel,
    starterPrice,
    region,
  ];
  if (requiredFields.some((field) => !field)) {
    return false;
  }

  if (
    name.length > 50 ||
    address.length === 0 ||
    district.length === 0 ||
    province.length === 0
  ) {
    return false;
  }

  if (postalcode.length !== 5) {
    return false;
  }

  if (!tel.match(/^0[0-9]{9}$/)) {
    return false;
  }

  if (amenities.length === 0 || roomType.length === 0) {
    return false;
  }

  if (
    roomType.some((room) => !room.type || !room.price || room.price <= 0) ||
    starterPrice <= 0
  ) {
    return false;
  }

  return true;
};
