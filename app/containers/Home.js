var React = require('react-native')


var UserOverlay = require('../components/overlay/userOverlay')
var Login = require('../components/login')
var TopicsInTab = require('../components/topicsInTab')
var MessageOverlay = require('../components/overlay/messageOverlay')


var routes = require('../configs/routes')

var config = require('../configs/config')
var window = require('../util/window')
var { width, height } = window.get()


var {
    View,
    Component,
    PropTypes,
    Text,
    StyleSheet,
    Image,

    } = React

class Home extends Component {
    constructor(props) {
        super(props)
    }


    _userOverlayOnPress() {
        let actions = this.props.actions
        let state = this.props.state
        if (!state.user.loginUser) {
            actions.openLoginModal()
        }
        else {
            routes.toUser(this, {
                isLoginUser: true
            })
        }
    }


    render() {
        let loginUser = this.props.state.user.loginUser
        let home = this.props.state.home
        let messageOverlay = (
            <MessageOverlay
                user={loginUser}
                getUnreadCount={this.props.actions.getUnreadMessageCount}
                count={this.props.state.message.unreadMessageCount}
                />
        )

        return (
            <View
                style={[styles.container]}>
                <Image
                    style={{height:height,width:width}}
                    source={{uri:config.bgImgUri}}>

                    <TopicsInTab/>
                </Image>

                <UserOverlay
                    ref='userOverlay'
                    user={loginUser}
                    onPress={this._userOverlayOnPress.bind(this)}
                    />


                {loginUser ? messageOverlay : null}


                <Login
                    isModalOpen={home.isModalOpen}
                    checkTokenLoading={home.checkTokenLoading}
                    actions={this.props.actions}
                    />


            </View>
        )
    }
}

Home.propTypes = {
    actions: PropTypes.object,
    state: PropTypes.object
}

var styles = StyleSheet.create({
    container: {
        width: width,
        "flex": 1,
        "backgroundColor": "transparent"
    },
    page: {
        width: width
    },
    scrollContainer: {
        height: height - 40,
        "flex": 1
    },
    listView: {
        backgroundColor: 'blue'
    },
    navScroll: {
        "height": 40,
        "backgroundColor": "rgba(0, 0, 0, 0.75)",
        "position": "absolute",
        "left": 0,
        "right": 0,
        "overflow": "hidden"
    }
});

module.exports = Home