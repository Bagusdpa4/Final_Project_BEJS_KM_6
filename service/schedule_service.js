const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const getDataFind = async (city_arrive_id, city_destination_id, date_departure, timeAsc, skip, take) => {

    return await prisma.flight.findMany({
        where: {
            city_arrive_id,
            city_destination_id,
            date_flight: date_departure,
            
        },
        skip,
        take,
        orderBy: {
            time_departure: timeAsc ? "asc" : "desc"
        },
        include: {
            city_arrive: {
                select: {
                    code: true,
                    name: true,
                    airport_name: true
                }
            },
            city_destination: {
                select: {
                    code: true,
                    name: true,
                    airport_name: true
                }
            },
        }
    })
}
const countDataFind = async (city_arrive_id, city_destination_id, date_departure) => {
    let arrive = await getCityId(city_arrive_id)
    let destination = await getCityId(city_destination_id)

    if (!arrive || !destination) {
        return null
    }

    return await prisma.flight.count({
        where: {
            city_arrive_id: arrive,
            city_destination_id: destination,
            date_flight: date_departure,
        }
    })
}

let getDetailFlightByFlightId = async (flightId) => {
    return await prisma.detailFlight.findMany({
        where: {
            flight_id: flightId
        },
        select: {
            id: true,
            price: true,
            detailPlaneId: {
                select: {
                    seat_class: {
                        select: {
                            id: true,
                            type_class: true
                        }
                    },
                    plane: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    })
}

let getDetailFlightById = async (detailFlightId) => {
    return await prisma.detailFlight.findUnique({
        where: {
            id: detailFlightId
        },
        select: {
            id: true,
            flight_id: true,
            detailPlaneId: {
                select: {
                    plane: {
                        select: {
                            name: true
                        }
                    },

                }
            },
            flight: {
                select: {
                    city_arrive: true,
                    city_destination: true,
                    estimation_minute: true
                }
            },
            price: true
        }
    })
}


let getDetailFlight = async () => {
    return await prisma.detailFlight.findMany({
        select: {
            id: true,
            flight_id: true,
            detailPlaneId: {
                select: {
                    plane: {
                        select: {
                            name: true
                        }
                    },

                }
            },
            flight: {
                select: {
                    city_arrive: true,
                    city_destination: true,
                    estimation_minute: true
                }
            },
            price: true
        },
        take: 5
    })
}


const createSchedule = async (flightData) => {
    try {
        const createdFlight = await prisma.flight.create({ data: flightData });

        const detailData = v.detail_data.map(detail => ({
            detail_plane_id: detail.detail_plane_id,
            price: detail.price,
            flight_id: createdFlight.id,
        }));

        return { createdFlight, detailData }
    } catch (error) {
        return { error }
    }

}

module.exports = {
    getDataFind,
    countDataFind,
    createSchedule,
    getDetailFlightById,
    getDetailFlight,
    getDetailFlightByFlightId
}