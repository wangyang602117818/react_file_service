﻿class ResourcesData extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <table className="table table_resource">
                <thead>
                    <tr>
                        <th width="18%">FileId</th>
                        <th width="30%">FileName</th>
                        <th width="10%">Size</th>
                        <th width="17%">UploadDate</th>
                        <th width="10%">From</th>
                        <th width="5%">View</th>
                        <th width="5%">Dol</th>
                        <th width="5%">Del</th>
                    </tr>
                </thead>
                <ResourcesList data={this.props.data} deleteItem={this.props.deleteItem} />
            </table>
        );
    }
}
class ResourcesList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var that = this;
        if (this.props.data.length == 0) {
            return (
                <tbody>
                    <tr>
                        <td colSpan='10'>... no data ...</td>
                    </tr>
                </tbody>
            )
        } else {
            return (
                <tbody>
                    {this.props.data.map(function (item, i) {
                        return (
                            <ResourceItem resource={item} key={i} deleteItem={that.props.deleteItem} />
                        )
                    })}
                </tbody>
            );
        }
    }
}
class ResourceItem extends React.Component {
    constructor(props) {
        super(props);
    }
    view(e) {
        var id = e.target.id;
        window.open(urls.preview + "?" + id, "_blank");
    }
    download(e) {
        var id = e.target.id;
        window.location.href = urls.downloadUrl + "/" + id;
    }
    render() {
        return (
            <tr>
                <td>{this.props.resource._id.$oid}</td>
                <td title={this.props.resource.filename }>{this.props.resource.filename.length > 30 ? this.props.resource.filename.substring(0, 30) + "..." : this.props.resource.filename}</td>
                <td>{convertFileSize(this.props.resource.length)}</td>
                <td>{parseBsonTime(this.props.resource.uploadDate)}</td>
                <td>{this.props.resource.metadata.From || "unknow"}</td>
                <td><i className="iconfont icon-view" onClick={this.view.bind(this)} id={"id=" + this.props.resource._id.$oid + "&type=" + this.props.resource.metadata.FileType}></i></td>
                <td>
                    <i className="iconfont icon-download" onClick={this.download.bind(this)} id={this.props.resource._id.$oid}></i>
                </td>
                <td>
                    <i className="iconfont icon-del" onClick={this.props.deleteItem} id={this.props.resource._id.$oid}></i>
                </td>
            </tr>
        )
    }
}
class Resources extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageShow: eval(localStorage.resource) ? true : false,
            imageShow: eval(localStorage.image_show) ? true : false,
            videoShow: eval(localStorage.video_show) ? true : false,
            attachmentShow: eval(localStorage.attachment_show) ? true : false,
            pageIndex: 1,
            pageSize: localStorage.handler_pageSize || 10,
            pageCount: 1,
            filter: "",
            data: { code: 0, message: "", count: 0, result: [] }
        }
        this.url = urls.resources.getUrl;
        this.storagePageShowKey = "resource";
        this.storagePageSizeKey = "handler_pageSize";
    }
    onImageShow() {
        if (this.state.imageShow) {
            this.setState({ imageShow: false });
            localStorage.image_show = false;
        } else {
            this.setState({ imageShow: true });
            localStorage.image_show = true;
        }
    }
    onVideoShow() {
        if (this.state.videoShow) {
            this.setState({ videoShow: false });
            localStorage.video_show = false;
        } else {
            this.setState({ videoShow: true });
            localStorage.video_show = true;
        }
    }
    onAttachmentShow() {
        if (this.state.attachmentShow) {
            this.setState({ attachmentShow: false });
            localStorage.attachment_show = false;
        } else {
            this.setState({ attachmentShow: true });
            localStorage.attachment_show = true;
        }
    }
    deleteItem(e) {
        var id = e.target.id;
        if (window.confirm(" Delete ?")) {
            var that = this;
            http.get(urls.deleteUrl + "?id=" + id, function (data) {
                if (data.code == 0) {
                    that.getData();
                }
                else {
                    alert(data.message);
                }
            });
        }
    }
    imageUpload(input, thumbnails, success, process) {
        var that = this;
        http.post(urls.resources.uploadImageUrl, {
            images: input,
            output: thumbnails.length > 0 ? JSON.stringify(thumbnails) : null
        }, function (data) {
            if (data.code == 0) that.getData();
            success(data);
        }, process);
    }
    videoUpload(input, videos, success, process) {
        var that = this;
        http.post(urls.resources.uploadVideoUrl, {
            videos: input,
            output: videos.length > 0 ? JSON.stringify(videos) : null
        }, function (data) {
            if (data.code == 0) that.getData();
            success(data);
        }, process);
    }
    attachmentUpload(input, success, process) {
        var that = this;
        http.post(urls.resources.uploadAttachmentUrl, {
            attachments: input
        }, function (data) {
            if (data.code == 0) that.getData();
            success(data);
        }, process);
    }
    render() {
        return (
            <div className="main">
                <h1>Resources</h1>
                <TitleArrow title="All Resources" show={this.state.pageShow}
                            count={this.state.data.count}
                            onShowChange={this.onPageShow.bind(this)} />
                <Pagination show={this.state.pageShow}
                            pageIndex={this.state.pageIndex}
                            pageSize={this.state.pageSize}
                            pageCount={this.state.pageCount}
                            filter={this.state.filter}
                            onInput={this.onInput.bind(this)}
                            onKeyPress={this.onKeyPress.bind(this)}
                            lastPage={this.lastPage.bind(this)}
                            nextPage={this.nextPage.bind(this)} />
                <ResourcesData data={this.state.data.result}
                               deleteItem={this.deleteItem.bind(this)} />
                <TitleArrow title="Add Image"
                            show={this.state.imageShow}
                            onShowChange={this.onImageShow.bind(this)} />
                <AddImage show={this.state.imageShow} imageUpload={this.imageUpload.bind(this)} />
                <TitleArrow title="Add Video"
                            show={this.state.videoShow}
                            onShowChange={this.onVideoShow.bind(this)} />
                <AddVideo show={this.state.videoShow} videoUpload={this.videoUpload.bind(this)} />
                <TitleArrow title="Add Attachment"
                            show={this.state.attachmentShow}
                            onShowChange={this.onAttachmentShow.bind(this)} />
                <AddAttachment show={this.state.attachmentShow} attachmentUpload={this.attachmentUpload.bind(this)} />
            </div>
        );
    }
}
for (var item in CommonUsePagination) Resources.prototype[item] = CommonUsePagination[item];
//Object.assign(Resources.prototype, CommonUsePagination);