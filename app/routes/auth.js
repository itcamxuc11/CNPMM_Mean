module.exports = function (app, express, passport) {
    var authRouter = express.Router();

    //Đăng nhạp bằng facebook
    authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
    // xử lý sau khi user cho phép xác thực với facebook
    authRouter.get('/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/api/useers'
        })
    );

    // Đăng nhập bằng google
    authRouter.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));
    authRouter.get('/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/'
        }), function(req, res){
            console.log('vua dang nhap'+req.user);
            res.redirect('/admin/student');
        });
    return authRouter;
}
