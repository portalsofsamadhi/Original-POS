"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNewsletter = exports.verifyToken = exports.authenticateSubscriber = exports.addSubscriber = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var mongoose_1 = __importDefault(require("mongoose"));
var subscriber_1 = require("../../mongodb-integration/src/backend/models/subscriber");
var transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // should be set in host env, not in repo
    }
});
var JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/newsletter', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
var addSubscriber = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedPassword, subscriber, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 1:
                hashedPassword = _a.sent();
                subscriber = new subscriber_1.Subscriber({
                    email: email,
                    password: hashedPassword,
                    subscriptionDate: new Date(),
                    isActive: true
                });
                // Save to database
                return [4 /*yield*/, subscriber.save()];
            case 2:
                // Save to database
                _a.sent();
                // Send welcome email
                return [4 /*yield*/, sendWelcomeEmail(email)];
            case 3:
                // Send welcome email
                _a.sent();
                return [2 /*return*/, true];
            case 4:
                error_1 = _a.sent();
                console.error('Failed to add subscriber:', error_1);
                return [2 /*return*/, false];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.addSubscriber = addSubscriber;
var authenticateSubscriber = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var subscriber, isValidPassword, token, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, subscriber_1.Subscriber.findOne({ email: email })];
            case 1:
                subscriber = _a.sent();
                if (!subscriber) {
                    return [2 /*return*/, null];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, subscriber.password)];
            case 2:
                isValidPassword = _a.sent();
                if (!isValidPassword) {
                    return [2 /*return*/, null];
                }
                token = jsonwebtoken_1.default.sign({ email: subscriber.email }, JWT_SECRET, { expiresIn: '365d' });
                return [2 /*return*/, token];
            case 3:
                error_2 = _a.sent();
                console.error('Authentication error:', error_2);
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.authenticateSubscriber = authenticateSubscriber;
var verifyToken = function (token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
var sendNewsletter = function (content) { return __awaiter(void 0, void 0, void 0, function () {
    var activeSubscribers, mailOptions, _i, activeSubscribers_1, subscriber, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, subscriber_1.Subscriber.find({ isActive: true })];
            case 1:
                activeSubscribers = _a.sent();
                mailOptions = {
                    from: process.env.EMAIL_USER,
                    subject: "Portal of Samadhi Newsletter: ".concat(content.title),
                    html: "\n                <h1>".concat(content.title, "</h1>\n                <p>").concat(content.summary, "</p>\n                <div>").concat(content.content, "</div>\n                <hr/>\n                <p>To unsubscribe from our newsletter, please click <a href=\"https://portalsofsamadhi.com/unsubscribe\">here</a></p>\n            ")
                };
                _i = 0, activeSubscribers_1 = activeSubscribers;
                _a.label = 2;
            case 2:
                if (!(_i < activeSubscribers_1.length)) return [3 /*break*/, 5];
                subscriber = activeSubscribers_1[_i];
                return [4 /*yield*/, transporter.sendMail(__assign(__assign({}, mailOptions), { to: subscriber.email }))];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, true];
            case 6:
                error_3 = _a.sent();
                console.error('Failed to send newsletter:', error_3);
                return [2 /*return*/, false];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.sendNewsletter = sendNewsletter;
