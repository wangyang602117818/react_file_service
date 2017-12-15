﻿class Top extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            role: ""
        }
    }
    componentDidMount() {
        var userName = document.getElementById("userName").value;
        var role = document.getElementById("role").value;
        this.setState({ name: userName, role: role });
    }
    render() {
        return (
            <div className="top">
                <div className="logo">
                    <img src="http://ywang363pri1:8987/image/logo.png" />
                </div>
                <div className="user">
                    <span className="user_tip">User:</span>
                    <span className="user_txt"> {this.state.name} | {this.state.role} </span>
                    <span className="logout">Log Out</span>
                </div>
            </div>
        );
    }
}
class Menu extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="menu">
                <ul>
                    <li>
                        <a className={this.props.style == "overview" ? "current" : ""}
                           onClick={this.props.menuClick}
                           id="overview">Overview</a>
                    </li>
                    <li>
                        <a className={this.props.style == "handlers" ? "current" : ""}
                           onClick={this.props.menuClick}
                           id="handlers">Handlers</a>
                    </li>
                    <li>
                        <a className={this.props.style == "tasks" ? "current" : ""}
                           onClick={this.props.menuClick}
                           id="tasks">Tasks</a>
                    </li>
                    <li>
                        <a className={this.props.style == "resources" ? "current" : ""}
                           onClick={this.props.menuClick}
                           id="resources">Resources</a>
                    </li>
                    <li>
                        <a className={this.props.style == "logs" ? "current" : ""}
                           onClick={this.props.menuClick}
                           id="logs">Logs</a>
                    </li>
                    {typeof (Config) === "undefined" ? null :
                    <li>
                        <a className={this.props.style == "config" ? "current" : ""}
                           onClick={this.props.menuClick}
                           id="config">Config</a>
                    </li>
                    }
                    {typeof (User) === "undefined" ? null :
                    <li>
                        <a className={this.props.style == "user" ? "current" : ""}
                           onClick={this.props.menuClick}
                           id="user">User</a>
                    </li>
                    }
                </ul>
            </div>
        );
    }
}
class Footer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="footer">
                Update:
                <select name="update" defaultValue={this.props.refresh} onChange={this.props.onRefreshChange}>
                    <option value="5">every 5 seconds</option>
                    <option value="15">every 15 seconds</option>
                    <option value="30">every 30 seconds</option>
                    <option value="300">every 5 minutes</option>
                    <option value="0">never</option>
                </select>
            </div>
        );
    }
}
class Container extends React.Component {
    constructor(props) {
        super(props);
        var menuValue = window.location.href.split("#")[1] || "overview";
        this.state = {
            menuStyle: menuValue,
            component: this.getComponent(menuValue),
            refresh: localStorage.refresh || 15          //刷新间隔
        }
    }
    getComponent(menu) {
        var component = null;
        switch (menu) {
            case "overview":
                component = Overview;
                break;
            case "handlers":
                component = Handlers;
                break;
            case "tasks":
                component = Tasks;
                break;
            case "resources":
                component = Resources;
                break;
            case "logs":
                component = Logs;
                break;
            case "config":
                component = typeof (ConfigContainer) === "undefined" ? Overview : ConfigContainer;
                break;
            case "user":
                component = typeof (User) === "undefined" ? Overview : User;
                break;
            default:
                component = Overview;
                break;
        }
        return component;
    }
    menuClick(e) {
        e.preventDefault();
        var value = e.target.id;
        if (this.state.menuStyle == value) return;
        var component = this.getComponent(value);
        this.setState({ menuStyle: value, component: component });
        window.history.replaceState({}, "", "#" + value);
    }
    onRefreshChange(e) {
        localStorage.refresh = e.target.value;
        this.setState({ refresh: e.target.value });
        this.refs.main.onRefreshChange(e.target.value);
    }
    render() {
        return (
            <div className="container">
                <Top />
                <Menu style={this.state.menuStyle} menuClick={this.menuClick.bind(this)} />
                <this.state.component ref="main" refresh={this.state.refresh} />
                <Footer onRefreshChange={this.onRefreshChange.bind(this)} refresh={this.state.refresh} />
            </div>
        );
    }
}
ReactDOM.render(
    <Container />,
    document.getElementById('index')
);