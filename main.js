const carCanvas = document.getElementById("carCanvas");
const networkCanvas = document.getElementById("networkCanvas");

carCanvas.width = 200;
networkCanvas.width = 400;
const carCtx = carCanvas.getContext("2d");
const netwokrCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 200;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        if (i !== 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.2);
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(0), -100.0, 30, 50, "DUMMY", 1, 5),
    new Car(road.getLaneCenter(1), -183.05, 30, 50, "DUMMY", 2.2),
    // new Car(road.getLaneCenter(2), -266.1, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -349.15, 30, 50, "DUMMY", 2.5),
    // new Car(road.getLaneCenter(1), -432.2, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -515.25, 30, 50, "DUMMY", 1.7),
    new Car(road.getLaneCenter(0), -598.31, 30, 50, "DUMMY", 2.1),
    new Car(road.getLaneCenter(1), -681.36, 30, 50, "DUMMY", 2.7),
    new Car(road.getLaneCenter(2), -764.41, 30, 50, "DUMMY", 1.8),
    // new Car(road.getLaneCenter(0), -847.46, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -930.51, 30, 50, "DUMMY", 1.5),
    new Car(road.getLaneCenter(2), -1013.56, 30, 50, "DUMMY", 1.9),
    // new Car(road.getLaneCenter(0), -1096.61, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -1179.66, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -1262.71, 30, 50, "DUMMY", 2.3),
    new Car(road.getLaneCenter(0), -1345.76, 30, 50, "DUMMY", 2.2),
    // new Car(road.getLaneCenter(1), -1428.81, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -1511.86, 30, 50, "DUMMY", 1.8),
    new Car(road.getLaneCenter(0), -1794.92, 30, 50, "DUMMY", 2.3),
    new Car(road.getLaneCenter(1), -1977.97, 30, 50, "DUMMY", 2.1),
];

// for (let i = 0; i < 60; i++) {
//     const lane = Math.floor(Math.random() * 3); // Assuming 3 lanes: 0, 1, 2
//     const y = -Math.random() * 5000; // y from -0 to -10000
//     const speed = Math.max(1.5, Math.floor(Math.random() * 2.5));
//     traffic.push(new Car(road.getLaneCenter(lane), y, 30, 50, "DUMMY", speed));
// }

function generateCars(N) {
    const cars = [];
    for (let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find((c) => c.y === Math.min(...cars.map((c) => c.y)));
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.8);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "red");
    }
    carCtx.globalAlpha = 0.2;

    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);

    carCtx.restore();
    netwokrCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(netwokrCtx, bestCar.brain);
    requestAnimationFrame(animate);
}

animate();
