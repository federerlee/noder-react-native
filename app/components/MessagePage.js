var React = require('react-native')
var moment = require('moment')


var config = require('../configs/config')


var window = require('../util/window')
var { width, height } = window.get()


var {
    View,
    StyleSheet,
    ScrollView,
    Component,
    Text,
    Image,
    ListView,
    ActivityIndicatorIOS,
    TouchableHighlight,
    Navigator
    } = React


var styles = StyleSheet.create({
    "row": {
        "height": 90,
        "flexDirection": "row",
        "borderBottomColor": "rgba(0, 0, 0, 0.02)",
        "borderBottomWidth": 1,
        "paddingTop": 25,
        "paddingRight": 0,
        "paddingBottom": 25,
        "paddingLeft": 20
    },
    "imgWrapper": {
        "width": 90,
        "position": "absolute",
        "left": 20,
        "top": 25,
        "height": 65
    },
    "img": {
        "height": 40,
        "width": 40,
        "borderRadius": 20
    },
    "topic": {
        "marginLeft": 60
    },
    "title": {
        "fontSize": 15
    },
    "topicFooter": {
        "marginTop": 10,
        "flexDirection": "row",
        width: width - (20 + 90)
    },
    "topicFooter text": {
        "fontSize": 11,
        "color": "rgba(0, 0, 0, 0.4)"
    },
    "topicFooter date": {
        "position": "absolute",
        "right": 0,
        "top": 0
    },
    "topicFooter count": {
        "marginRight": 15
    },
    "topicFooter top": {
        "fontSize": 11,
        "marginTop": 1,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 10,
        "color": "#E74C3C"
    },
    "topicFooter good": {
        "fontSize": 11,
        "marginTop": 1,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 10,
        "color": "#2ECC71"
    },
    "topicFooter tab": {
        "fontSize": 11,
        "marginTop": 1,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 10
    },
    "loading": {
        "marginTop": 250
    },
    rowFooterText: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.7)'
    },
    atText: {
        color: '#E74C3C'
    },
    replyText: {
        color: '#2980B9'
    },
    emptyMessage: {
        marginTop: 80,
        flex: 1
    },
    emptyMessageText: {
        textAlign: 'center',
        color: '#3498DB',
        fontSize: 24
    }

})


class MessagePage extends Component {
    constructor(props) {
        super(props)
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.state = {
            ds: this.ds.cloneWithRows(this.props.data)
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.data != this.props.data) {
            this.setState({
                ds: this.ds.cloneWithRows(nextProps.data)
            })
        }
    }


    _onRowPress(message) {
        this.props.router.toComments({
            topic: message.topic,
            from: 'message',
            reply: message.reply
        })
    }


    _renderRowFooter(message) {
        var date = moment(message.reply.create_at).startOf('minute').fromNow()

        return (
            <View style={styles.topicFooter}>
                <Text style={styles['topicFooter text']}>
                    <Text>
                        {message.author.loginname}
                    </Text>
                    <Text style={styles[message.type+'Text']}>
                        {message.type == 'reply' ? ' 回复' : ' @'}
                    </Text>
                </Text>

                <Text style={[styles['topicFooter date'],styles['topicFooter text']]}>
                    {date}
                </Text>
            </View>
        )
    }


    _renderLoading() {
        if (this.props.isLoading) {
            return (
                <ActivityIndicatorIOS
                    size="large"
                    animating={this.props.isLoading}
                    style={{marginTop:20,width:width}}/>
            )
        }
        return null;
    }


    _renderRow(message) {
        var topic = message.topic
        var title = topic.title
        var titleLength = Math.floor((width - 100) / 15) + 2
        if (title.length > titleLength) {
            title = title.substring(0, titleLength - 3) + '...'
        }


        return (
            <TouchableHighlight
                onPress={()=>{this._onRowPress(message)}}
                underlayColor='#3498DB'
                key={message.id}>
                <View style={styles.row}>
                    <View style={styles.imgWrapper}>
                        <Image
                            style={styles.img}
                            source={{uri:config.domain + message.author.avatar_url}}
                            >
                        </Image>
                    </View>

                    <View style={[styles.topic]}>
                        <Text style={[styles.title]}>
                            {title}
                        </Text>

                        <View style={[styles.topicFooter]}>
                            {this._renderRowFooter(message)}
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }


    _renderEmptyMessage() {
        if (this.props.data.length == 0 && this.props.isLoading == false) {
            return (
                <View style={styles.emptyMessage}>
                    <Text style={styles.emptyMessageText}>
                        空空哒
                    </Text>
                </View>
            )
        }
    }


    _renderListView() {
        if (this.props.didFocus) {
            return (
                <ListView
                    style={{backgroundColor:'rgba(255,255,255,1)'}}
                    showsVerticalScrollIndicator={true}
                    initialListSize={10}
                    pagingEnabled={false}
                    removeClippedSubviews={true}
                    dataSource={this.state.ds}
                    renderRow={this._renderRow.bind(this)}
                    onEndReachedThreshold={100}
                    />
            )
        }
        return null
    }


    render() {
        return (
            <View style={[{width:width,height:height - 40},{backgroundColor:'white'}]}>
                {this._renderLoading()}
                {this._renderEmptyMessage()}
                {this._renderListView()}
            </View>
        )
    }
}


module.exports = MessagePage
