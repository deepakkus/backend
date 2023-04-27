var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({status: false})
});

const UserController = require('../../../Controller/Auth/User');
const AdminController = require('../../../Controller/Auth/Admin');
const OrganizerController = require('../../../Controller/Auth/Organizer');

const EventTypeController = require('../../../Controller/Admin/EventType');
const GetHelpController = require('../../../Controller/Admin/GetHelp');
const PrivacyPolicyController = require('../../../Controller/Admin/PrivacyPolicy');

const FavoriteDrinkController = require('../../../Controller/Admin/FavoriteDrink');
const MusicTypeController = require('../../../Controller/Admin/MusicType');
const OrganizerTypeController = require('../../../Controller/Admin/OrganizerType');
const MenuCategoryController = require('../../../Controller/Admin/MenuCategory');
const MenuMangeController = require('../../../Controller/Admin/MenuMange');
const UserAdminController = require('../../../Controller/Admin/User');
const OrganizerAdminController = require('../../../Controller/Admin/Organizer');
const EventAdminController = require('../../../Controller/Admin/Event');
const EventReviewAdminController = require('../../../Controller/Admin/Review');
const EmailManagementController = require('../../../Controller/Admin/EmailContent');
const CategoryManagementController = require('../../../Controller/Admin/Category');
const NewsManagementController = require('../../../Controller/Admin/News');

const CommonController = require('../../../Controller/Common');

const EventOrganizerController = require('../../../Controller/Organizer/Event');
const MenuListOrganizerController = require('../../../Controller/Organizer/MenuList');
const PackageOrganizerController = require('../../../Controller/Organizer/Package');
const TableListOrganizerController = require('../../../Controller/Organizer/TableList');
const TicketOrganizerController = require('../../../Controller/Organizer/Ticket');
const PromotionsOrganizerController = require('../../../Controller/Organizer/Promotions');
const MenuOrganizerController = require('../../../Controller/Organizer/Menu');
const FollowOrganizerController = require('../../../Controller/Organizer/Follow');



const EventUserController = require('../../../Controller/User/Event');
const PromoCodeController = require('../../../Controller/User/Promotions');

const EventReviewsUserController = require('../../../Controller/User/EventReviews');
const FollowUserController = require('../../../Controller/User/Follow');
const ContactUsUserController = require('../../../Controller/User/ContactUs');






const middleware  = require('../../../service/middleware').middleware;


const multer = require('multer');
const userUserController = require('../../../Controller/User');
const { sendMessage, sendList, singelMessage, deleteMessage, isSeenMessage } = require('../../../Controller/User/Message');
const { viewAllOrganizerActive } = require('../../../Controller/Organizer/Active');
const { viewAllUserActive } = require('../../../Controller/User/Active');
const { PayNowSplitDue } = require('../../../Controller/Organizer/Payment');
 
var storage = multer.memoryStorage()
var upload = multer({storage: storage});


/** ================================= without login url ================================= */

router.post('/user/register', UserController.register);
router.post('/user/login', UserController.login);
router.get('/user/login-guest', UserController.loginGuest);
router.post('/user/login-otp', UserController.loginOtp);
router.post('/user/login-otp-check', UserController.loginOtpCheck);
router.post('/user/forget-otp-request', UserController.otpRequest);
router.post('/user/forget-otp-check', UserController.forgetPassword);
router.post('/user/fcmtoken', UserController.setFCMToken);




router.post('/admin/login', AdminController.login);
router.post('/admin/register', AdminController.register);

router.post('/organizer/login', OrganizerController.login);
router.post('/organizer/register', OrganizerController.register);

/** ================================= without login url section end ================================ */

router.get('/admin/event-type', EventTypeController.viewAll);
router.get('/admin/favorite-drink', FavoriteDrinkController.viewAll);
router.get('/admin/music-type', MusicTypeController.viewAll);
router.get('/admin/organizer-type', OrganizerTypeController.viewAll);

router.get('/admin/get-help', GetHelpController.viewAll);
router.get('/admin/privacy-policy', PrivacyPolicyController.viewAll);
router.get('/admin/email-content', EmailManagementController.viewAll);
router.get('/admin/category', CategoryManagementController.viewAll);
router.get('/admin/news', NewsManagementController.viewAll);
router.post('/admin/category/upload', upload.single("image"), CategoryManagementController.ImageUpload);


/** ================================= Common api part ================================ */
router.get('/state', CommonController.viewAllState);
router.get('/city/:id', CommonController.viewAllCity);
router.get('/category', CommonController.viewAllCategory);
router.get('/news', CommonController.viewAllNews);
router.get('/event', CommonController.viewAllEvent);
router.get('/events', CommonController.viewTomorrowEvent);
router.get('/allcatevents', CommonController.viewAllCatEvents);
router.get('/eventdetails/:id', CommonController.getSingleEvent);
router.get('/catevents/:id', CommonController.viewCategoryEvent);
router.post('/pincode', CommonController.PingCodeAdd);
router.get('/pincode/:code', CommonController.PingCodeGet);

router.get('/user/profile/:id', userUserController.getUserProfile);




router.use(middleware); // ========> auth setup 


/** ================================= User section ================================ */
router.get('/user', UserController.getProfile);
// router.get('/user/profile/:id', userUserController.getUserProfile);

router.put('/user', UserController.update);
router.put('/user/password', UserController.passwordChange);
router.post('/user/upload', upload.single("image"), UserController.profilePicUpload);
// router.post('/user/upload', upload.single("image"), UserController.imageUpload);
router.post('/user/find', userUserController.findUser);
router.post('/user/invite', userUserController.inviteUser);
router.post('/user/payment-method', userUserController.createPaymentMethod);
router.get('/user/payment-method', userUserController.viewAllPaymentMethod);
router.put('/user/payment-method/:id', userUserController.defaultPaymentMethod);
router.post('/user/payment-now', userUserController.PayNowSingel);
router.post('/user/payment-split', userUserController.PayNowSplit);
router.delete('/user/payment-method/:id', userUserController.DeletePaymentMethod);





router.get('/user/active', viewAllUserActive);


router.post('/user/add-favoritedrink', CommonController.FavoriteDrinkCreate);
router.get('/user/event', EventUserController.viewAll);
router.get('/user/event/booking', EventUserController.viewAllBooking);
router.get('/user/event/booking/:id', EventUserController.singelBooking);
router.put('/user/event/booking/:id', EventUserController.updateBooking);

router.post('/user/event/booking-cancel', EventUserController.eventBookingCancel);


router.post('/user/event/invite', EventUserController.inviteBooking);
router.post('/user/event/split-user', EventUserController.singelUserAdd);
router.delete('/user/event/split-user/:id', EventUserController.SplitUserDelete);
router.put('/user/event/split-user/:id', EventUserController.approvedSplitUser);




router.get('/user/event/disting-state', EventUserController.distingState);




router.post('/user/event/promocode', PromoCodeController.viewSingel);
router.post('/user/event/booking', EventUserController.createBooking);
router.get('/user/event/booking', EventUserController.viewAllBooking);
router.get('/user/event/own-user/:id', EventUserController.owmeventUser);
router.get('/user/event/user/:id', EventUserController.eventUser);
router.get('/user/event/split-user/:id', EventUserController.splitUserList);


router.get('/user/event/:id', EventUserController.viewSingel);

router.post('/user/reviews', EventReviewsUserController.create);
router.get('/user/reviews', EventReviewsUserController.viewAll);
router.get('/user/reviews/:id', EventReviewsUserController.viewSingel);
router.put('/user/reviews/:id', EventReviewsUserController.update);
router.delete('/user/reviews/:id', EventReviewsUserController.Delete);

router.post('/user/follow', FollowUserController.create);
router.put('/user/follow/:id', FollowUserController.update);
router.get('/user/followers', FollowUserController.followers);
router.get('/user/following', FollowUserController.following);
router.get('/user/follow/request', FollowUserController.request);




router.post('/user/message', sendMessage);
router.get('/user/message', sendList);
router.get('/user/message/:id', singelMessage);
router.put('/user/message/:id', isSeenMessage);
router.delete('/user/message/:id', deleteMessage);

router.post('/user/contact-us', ContactUsUserController.create);
router.put('/user/contact-us/:id', ContactUsUserController.update);
router.get('/user/contact-us', ContactUsUserController.viewAll);











/** ================================= Organizer section ================================ */
router.get('/organizer', OrganizerController.getProfile);
router.get('/organizer/profile/:id', OrganizerController.getProfileIdOrganizer);


router.put('/organizer', OrganizerController.update);
router.post('/organizer/upload', upload.single("image"), OrganizerController.profilePicUpload);


router.post('/organizer/event', EventOrganizerController.create);
router.get('/organizer/event', EventOrganizerController.viewAll);
router.get('/organizer/event/active', EventOrganizerController.viewAllActive);
router.get('/organizer/event/djnane', EventOrganizerController.GetDjName);
router.get('/organizer/event/special-guests', EventOrganizerController.GetSpecialGuestsName);
router.post('/organizer/event/code-check', EventOrganizerController.CheckCode);

router.get('/organizer/event/booking-his', EventOrganizerController.viewAllBookingHis);
router.get('/organizer/event/:id', EventOrganizerController.viewSingel);
router.put('/organizer/event/:id', EventOrganizerController.update);
router.delete('/organizer/event/:id', EventOrganizerController.Delete);
router.post('/organizer/event/upload', upload.single("image"), EventOrganizerController.ImageUpload);
router.get('/organizer/event/booking/:id', EventOrganizerController.viewAllBooking);
router.put('/organizer/event/booking/:id', EventOrganizerController.BookingConfrim);
router.get('/organizer/event/qr-code/:id', EventOrganizerController.QrBooking);
router.post('/organizer/event/due-payment', PayNowSplitDue);




router.post('/organizer/menu-list', MenuListOrganizerController.create);
router.get('/organizer/menu-list', MenuListOrganizerController.viewAll);
router.get('/organizer/menu-list/:id', MenuListOrganizerController.viewSingel);
router.put('/organizer/menu-list/:id', MenuListOrganizerController.update);
router.delete('/organizer/menu-list/:id', MenuListOrganizerController.Delete);

router.post('/organizer/menu', MenuOrganizerController.create);
router.get('/organizer/menu', MenuOrganizerController.viewAll);
router.get('/organizer/menu/:id', MenuOrganizerController.viewSingel);
router.put('/organizer/menu/:id', MenuOrganizerController.update);
router.delete('/organizer/menu/:id', MenuOrganizerController.Delete);

router.post('/organizer/package', PackageOrganizerController.create);
router.get('/organizer/package', PackageOrganizerController.viewAll); 
router.get('/organizer/package/:id', PackageOrganizerController.viewSingel);
router.put('/organizer/package/:id', PackageOrganizerController.update);
router.delete('/organizer/package/:id', PackageOrganizerController.Delete);

router.post('/organizer/table-list', TableListOrganizerController.create);
router.get('/organizer/table-list', TableListOrganizerController.viewAll);
router.get('/organizer/table-list/:id', TableListOrganizerController.viewSingel);
router.put('/organizer/table-list/:id', TableListOrganizerController.update);
router.delete('/organizer/table-list/:id', TableListOrganizerController.Delete);

router.post('/organizer/ticket', TicketOrganizerController.create);
router.get('/organizer/ticket', TicketOrganizerController.viewAll);
router.get('/organizer/ticket/:id', TicketOrganizerController.viewSingel);
router.put('/organizer/ticket/:id', TicketOrganizerController.update);
router.delete('/organizer/ticket/:id', TicketOrganizerController.Delete);

router.post('/organizer/promotions', PromotionsOrganizerController.create);
router.get('/organizer/promotions', PromotionsOrganizerController.viewAll);
router.get('/organizer/promotions/:id', PromotionsOrganizerController.viewSingel);
router.put('/organizer/promotions/:id', PromotionsOrganizerController.update);
router.delete('/organizer/promotions/:id', PromotionsOrganizerController.Delete);

router.post('/organizer/follow', FollowOrganizerController.create);
router.put('/organizer/follow/:id', FollowOrganizerController.update);
router.get('/organizer/followers', FollowOrganizerController.followers);
router.get('/organizer/following', FollowOrganizerController.following);
router.get('/organizer/follow/request', FollowOrganizerController.request);


router.get('/organizer/active', viewAllOrganizerActive);

/** ================================= Admin section ================================ */
router.get('/admin', AdminController.getProfile);
router.put('/admin', AdminController.update);
router.put('/admin/password', AdminController.passwordChange);
// router.post('/admin/upload', upload.single("image"), AdminController.imageUpload);


router.post('/admin/event-type', EventTypeController.create);
router.post('/admin/favorite-drink', FavoriteDrinkController.create);
router.post('/admin/music-type', MusicTypeController.create);
router.post('/admin/organizer-type', OrganizerTypeController.create);
router.post('/admin/menu-category', MenuCategoryController.create);
router.post('/admin/menu-mange', MenuMangeController.create);
router.post('/admin/get-help', GetHelpController.create);
router.post('/admin/privacy-policy', PrivacyPolicyController.create);
router.post('/admin/email-content', EmailManagementController.create);
router.post('/admin/category', CategoryManagementController.create);




router.put('/admin/event-type/:id', EventTypeController.update);
router.put('/admin/favorite-drink/:id', FavoriteDrinkController.update);
router.put('/admin/music-type/:id', MusicTypeController.update);
router.put('/admin/organizer-type/:id', OrganizerTypeController.update);
router.put('/admin/menu-category/:id', MenuCategoryController.update);
router.put('/admin/menu-mange/:id', MenuMangeController.update);
router.put('/admin/get-help/:id', GetHelpController.update);
router.put('/admin/privacy-policy/:id', PrivacyPolicyController.update);
router.put('/admin/email-content/:id', EmailManagementController.update);
router.put('/admin/category/:id', CategoryManagementController.update);



router.delete('/admin/event-type/:id', EventTypeController.Delete);
router.delete('/admin/favorite-drink/:id', FavoriteDrinkController.Delete);
router.delete('/admin/music-type/:id', MusicTypeController.Delete);
router.delete('/admin/organizer-type/:id', OrganizerTypeController.Delete);
router.delete('/admin/menu-category/:id', MenuCategoryController.Delete);
router.delete('/admin/menu-mange/:id', MenuMangeController.Delete);
router.delete('/admin/get-help/:id', GetHelpController.Delete);
router.delete('/admin/privacy-policy/:id', PrivacyPolicyController.Delete);
router.delete('/admin/email-content/:id', EmailManagementController.Delete);
router.delete('/admin/category/:id', CategoryManagementController.Delete);

router.get('/admin/menu-category', MenuCategoryController.viewAll);
router.get('/admin/menu-mange', MenuMangeController.viewAll);

router.get('/admin/user', UserAdminController.viewAll);
router.get('/admin/user/:id', UserAdminController.viewSingel);
router.put('/admin/user/:id', UserAdminController.update);
router.delete('/admin/user/:id', UserAdminController.DeleteParmanet);
router.post('/admin/user/upload', upload.single("image"), UserAdminController.ImageUpload);



router.get('/admin/organizer', OrganizerAdminController.viewAll);
router.get('/admin/organizer/:id', OrganizerAdminController.viewSingel);
router.put('/admin/organizer/:id', OrganizerAdminController.update);
router.delete('/admin/organizer/:id', OrganizerAdminController.Delete);
router.post('/admin/organizer/upload', upload.single("image"), OrganizerAdminController.ImageUpload);

router.get('/admin/event', EventAdminController.viewAll);
router.get('/admin/event/:id', EventAdminController.viewSingel);
router.put('/admin/event/:id', EventAdminController.update);
router.delete('/admin/event/:id', EventAdminController.Delete);
router.post('/admin/event/upload', upload.single("image"), EventAdminController.ImageUpload);

router.get('/admin/get-help/:id', GetHelpController.viewSingel);
router.get('/admin/privacy-policy/:id', PrivacyPolicyController.viewSingel);


router.put('/admin/contact-us/:id', ContactUsUserController.update);
router.get('/admin/contact-us', ContactUsUserController.viewAll);

router.get('/admin/event-review', EventReviewAdminController.viewAll);
router.get('/admin/event-review/:eventId', EventReviewAdminController.viewAllByEvent);
router.get('/admin/event-review/:orgazierId', EventReviewAdminController.viewAllByEvent);




module.exports = router;
