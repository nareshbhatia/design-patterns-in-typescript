/**
 * A vacation package is a collection of products.
 *
 * Products are unrelated to each other. In other words,
 * they do not inherit from a common abstract class such as Product.
 * The only requirement is that a product must implement the VisitableProduct interface.
 */
// ----- ProductVisitor -----
interface ProductVisitor {
    visitFlight(flight: Flight);
    visitHotel(hotel: Hotel);
    visitCar(car: Car);
    visitActivity(activity: Activity);
}

// ----- PricingVisitor (implements ProductVisitor) -----
class PricingVisitor implements ProductVisitor {
    price = 0;

    visitFlight(flight: Flight) {
        this.price += flight.price;
    }

    visitHotel(hotel: Hotel) {
        this.price +=
            numDays(hotel.checkInDate, hotel.checkOutDate) * hotel.roomRate;
    }

    visitCar(car: Car) {
        this.price += numDays(car.pickupDate, car.dropOffDate) * car.dailyRate;
    }

    visitActivity(activity: Activity) {
        this.price += activity.cost;
    }
}

// ----- ItineraryVisitor (implements ProductVisitor) -----
class ItineraryVisitor implements ProductVisitor {
    itinerary = 'Itinerary\n=========';

    visitFlight(flight: Flight) {
        this.itinerary +=
            '\n\n' +
            'Flight\n' +
            '------\n' +
            `${flight.flightNumber}: ${flight.origin}-${flight.destination}\n` +
            `Dep: ${formatDateTime(flight.departureTime)}\n` +
            `Price: $${flight.price}`;
    }

    visitHotel(hotel: Hotel) {
        this.itinerary +=
            '\n\n' +
            'Hotel\n' +
            '-----\n' +
            `${hotel.id}\n` +
            `Check in:  ${formatDate(hotel.checkInDate)}\n` +
            `Check out: ${formatDate(hotel.checkOutDate)}\n` +
            `Room rate: $${hotel.roomRate}/night`;
    }

    visitCar(car: Car) {
        this.itinerary +=
            '\n\n' +
            'Car\n' +
            '---\n' +
            `Vehicle type:${car.vehicleType}\n` +
            `Pick up:  ${formatDate(car.pickupDate)}\n` +
            `Drop off: ${formatDate(car.dropOffDate)}\n` +
            `Daily rate: $${car.dailyRate}`;
    }

    visitActivity(activity: Activity) {
        this.itinerary +=
            '\n\n' +
            'Activity\n' +
            '--------\n' +
            `${activity.id}\n` +
            `${formatDateTime(activity.startTime)}\n` +
            `Cost: $${activity.cost}`;
    }
}

// ----- VisitableProduct -----
interface VisitableProduct {
    accept(v: ProductVisitor);
}

// ----- Entities implementing the VisitableProduct interface -----
class Flight implements VisitableProduct {
    constructor(
        public flightNumber: string,
        public origin: string,
        public destination: string,
        public departureTime: Date,
        public price: number
    ) {}

    public accept(v: ProductVisitor) {
        v.visitFlight(this);
    }
}

class Hotel implements VisitableProduct {
    constructor(
        public id: string,
        public checkInDate: Date,
        public checkOutDate: Date,
        public roomRate: number
    ) {}

    public accept(v: ProductVisitor) {
        v.visitHotel(this);
    }
}

class Car implements VisitableProduct {
    constructor(
        public vehicleType: string,
        public pickupDate: Date,
        public dropOffDate: Date,
        public dailyRate: number
    ) {}

    public accept(v: ProductVisitor) {
        v.visitCar(this);
    }
}

class Activity implements VisitableProduct {
    constructor(
        public id: string,
        public startTime: Date,
        public cost: number
    ) {}

    public accept(v: ProductVisitor) {
        v.visitActivity(this);
    }
}

// ----- VacationPackage (a collection of products) -----
class VacationPackage {
    products: Array<VisitableProduct> = [];

    add(product: VisitableProduct) {
        this.products.push(product);
    }

    calculatePrice() {
        const pricingVisitor = new PricingVisitor();
        this.products.forEach(product => product.accept(pricingVisitor));
        return pricingVisitor.price;
    }

    getItinerary() {
        const itineraryVisitor = new ItineraryVisitor();
        this.products.forEach(product => product.accept(itineraryVisitor));
        return itineraryVisitor.itinerary;
    }
}

// ----- Helper functions -----
const millisPerDay = 24 * 60 * 60 * 1000;

function numDays(startDate: Date, endDate: Date) {
    const millis = endDate.getTime() - startDate.getTime();
    return millis / millisPerDay;
}

function formatDate(date: Date) {
    return date.toLocaleDateString();
}

function formatDateTime(date: Date) {
    var options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
}

// ----- Test -----
const pkg = new VacationPackage();
const startDate = new Date('2019-12-30');
const endDate = new Date('2020-01-01');
pkg.add(new Flight('TV 312', 'BOS', 'JFK', startDate, 300));
pkg.add(new Flight('TV 313', 'JFK', 'BOS', endDate, 300));
pkg.add(new Hotel('Hilton Times Square', startDate, endDate, 400));
pkg.add(new Car('SUV', startDate, endDate, 150));
pkg.add(new Activity('Hamilton', startDate, 200));

const price = pkg.calculatePrice();
const itinerary = pkg.getItinerary();

console.log(itinerary);
console.log();
console.log(`----------------------------------------------------`);
console.log(`Total price: ${price}`);
console.log(`----------------------------------------------------`);
