"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var faker_1 = require("@faker-js/faker");
var Product_1 = require("../models/Product"); // adjust path if needed (e.g. "@/models/Product")
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/inventory_db";
// 🎯 Helper: Random pick
var random = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
// 🧩 Possible values
var assetTypes = [
    "Laptop",
    "Monitor",
    "Keyboard",
    "Mouse",
    "Printer",
    "Docking Station",
    "Headphones",
    "Desktop",
    "Tablet",
];
var statuses = ["Available", "Assigned", "Under Repair", "Retired"];
var conditions = ["New", "Good", "Fair", "Poor"];
var departments = ["IT", "HR", "Finance", "Marketing", "Design", "Development", "Operations", "Support"];
var locations = ["Head Office", "Remote", "Branch A", "Branch B", "Repair Center", "Storage"];
var categories = ["Electronics", "Peripherals", "Office Equipment", "Accessories"];
// 🧠 Generate one product
var createProduct = function () {
    var assetType = random(assetTypes);
    var status = random(statuses);
    var department = random(departments);
    var condition = random(conditions);
    var location = random(locations);
    var category = random(categories);
    var assigned = status === "Assigned";
    var purchaseDate = faker_1.faker.date.between({ from: "2021-01-01", to: "2024-12-31" });
    var warrantyExpiry = faker_1.faker.date.future({ years: 2, refDate: purchaseDate });
    return {
        name: "".concat(faker_1.faker.company.name(), " ").concat(assetType),
        assetType: assetType,
        serialNumber: faker_1.faker.string.alphanumeric(10).toUpperCase(),
        brand: faker_1.faker.company.name(),
        productModel: "".concat(faker_1.faker.word.noun(), "-").concat(faker_1.faker.number.int({ min: 100, max: 999 })),
        sku: faker_1.faker.string.uuid(),
        status: status,
        condition: condition,
        employeeName: assigned ? faker_1.faker.person.fullName() : undefined,
        employeeId: assigned ? faker_1.faker.string.alphanumeric(6).toUpperCase() : undefined,
        employeeEmail: assigned ? faker_1.faker.internet.email() : undefined,
        department: assigned ? department : undefined,
        assignmentDate: assigned ? faker_1.faker.date.recent({ days: 90 }) : undefined,
        returnDate: assigned ? faker_1.faker.date.future({ years: 1 }) : undefined,
        purchaseDate: purchaseDate,
        warrantyExpiry: warrantyExpiry,
        location: location,
        price: faker_1.faker.number.int({ min: 100, max: 5000 }),
        description: faker_1.faker.commerce.productDescription(),
        category: category,
        quantity: 1,
        image: faker_1.faker.image.urlPicsumPhotos(),
    };
};
// 🚀 Seed script
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var products, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, mongoose_1.default.connect(MONGODB_URI)];
                case 1:
                    _a.sent();
                    console.log("✅ Connected to MongoDB");
                    return [4 /*yield*/, Product_1.default.deleteMany({})];
                case 2:
                    _a.sent();
                    console.log("🧹 Cleared old data");
                    products = Array.from({ length: 1000 }, createProduct);
                    return [4 /*yield*/, Product_1.default.insertMany(products)];
                case 3:
                    _a.sent();
                    console.log("🌱 Inserted 1000 fake products successfully!");
                    return [4 /*yield*/, mongoose_1.default.disconnect()];
                case 4:
                    _a.sent();
                    console.log("🔌 Disconnected from MongoDB");
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("❌ Error seeding products:", error_1);
                    process.exit(1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
seed();
