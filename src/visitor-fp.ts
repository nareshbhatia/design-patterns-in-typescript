/**
 * A vacation package is a collection of products.
 *
 * Products are unrelated to each other. In other words,
 * they do not inherit from a common abstract class such as Product.
 */
// ----- Products -----
class Flight {
    constructor(
        public flightNumber: string,
        public origin: string,
        public destination: string,
        public departureTime: Date,
        public price: number
    ) {}
}

class Hotel {
    constructor(
        public id: string,
        public checkInDate: Date,
        public checkOutDate: Date,
        public roomRate: number
    ) {}
}

class Car {
    constructor(
        public vehicleType: string,
        public pickupDate: Date,
        public dropOffDate: Date,
        public dailyRate: number
    ) {}
}

class Activity {
    constructor(
        public id: string,
        public startTime: Date,
        public cost: number
    ) {}
}

type Product = Flight | Hotel | Car | Activity;

// ----- calculatePrice -----
function calculatePrice(product: Product): number {
    if (product instanceof Flight) {
        return product.price;
    } else if (product instanceof Hotel) {
        return (
            numDays(product.checkInDate, product.checkOutDate) *
            product.roomRate
        );
    } else if (product instanceof Car) {
        return (
            numDays(product.pickupDate, product.dropOffDate) * product.dailyRate
        );
    } else if (product instanceof Activity) {
        return product.cost;
    }
}

// ----- getItinerary -----
function getItinerary(product: Product) {
    if (product instanceof Flight) {
        return (
            'Flight\n' +
            '------\n' +
            `${product.flightNumber}: ${product.origin}-${
                product.destination
            }\n` +
            `Dep: ${formatDateTime(product.departureTime)}\n` +
            `Price: $${product.price}`
        );
    } else if (product instanceof Hotel) {
        return (
            'Hotel\n' +
            '-----\n' +
            `${product.id}\n` +
            `Check in:  ${formatDate(product.checkInDate)}\n` +
            `Check out: ${formatDate(product.checkOutDate)}\n` +
            `Room rate: $${product.roomRate}/night`
        );
    } else if (product instanceof Car) {
        return (
            'Car\n' +
            '---\n' +
            `Vehicle type:${product.vehicleType}\n` +
            `Pick up:  ${formatDate(product.pickupDate)}\n` +
            `Drop off: ${formatDate(product.dropOffDate)}\n` +
            `Daily rate: $${product.dailyRate}`
        );
    } else if (product instanceof Activity) {
        return (
            'Activity\n' +
            '--------\n' +
            `${product.id}\n` +
            `${formatDateTime(product.startTime)}\n` +
            `Cost: $${product.cost}`
        );
    }
}

// ----- VacationPackage (a collection of products) -----
class VacationPackage {
    products: Array<Product> = [];

    add(product: Product) {
        this.products.push(product);
    }

    calculatePrice() {
        return this.products.reduce(
            (accumulator, product) => accumulator + calculatePrice(product),
            0
        );
    }

    getItinerary() {
        return this.products.reduce(
            (accumulator, product) =>
                accumulator + '\n\n' + getItinerary(product),
            'Itinerary\n========='
        );
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
    const options = {
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
