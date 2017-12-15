var http = {
    post: function (url, data, success, progress, error) {
        var formData = new FormData();
        formData.append("AppName", "FileServiceApi");
        for (var item in data) {
            if (!data[item]) continue;
            if (data[item].nodeName && data[item].nodeName.toLowerCase() === "input") {
                for (var i = 0; i < data[item].files.length; i++) {
                    formData.append(item.toLowerCase(), data[item].files[i]);
                }
            } else {
                if (data[item] instanceof Array) {
                    for (var i = 0; i < data[item].length; i++) {
                        formData.append(item.toLowerCase(), data[item][i]);
                    }
                } else {
                    formData.append(item.toLowerCase(), data[item]);
                }
            }
        }
        var xhr = new XMLHttpRequest();
        xhr.upload.onprogress = function (event) {
            if (progress) progress(event.loaded, event.total);
        }
        xhr.onload = function (event) {
            var target = event.srcElement || event.target;
            success(JSON.parse(target.responseText));
        }
        xhr.onerror = function (event) {
            if (error) error(event);
        }
        xhr.open('post', url);
        xhr.send(formData);
    },
    get: function (url, success, error) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function (event) {
            var target = event.srcElement || event.target;
            success(JSON.parse(target.responseText));
        };
        if (error) xhr.onerror = error;
        xhr.open('get', url);
        xhr.send();
    }
};
var base = "http://ywang363pri1:8987";
var urls = {
    preview: base+"/admin/preview",
    deleteUrl: base + "/admin/delete",
    downloadUrl: base + "/download/get",
    redoUrl: base + "/admin/redo",
    emptyUrl: base + "/admin/empty",
    overview: {
        recentUrl: base + "/admin/getCountRecentMonth",
        totalUrl: base + "/admin/getTotalCount",
        countByAppName: base + "/admin/getFilesByAppName"
    },
    log: {
        getUrl: base + "/admin/getlogs"
    },
    handlers: {
        getUrl: base + "/admin/gethandlers"
    },
    tasks: {
        getUrl: base + "/admin/gettasks",
        getByIdUrl: base + "/admin/getTaskById",
        updateImageUrl: base + "/admin/updateImageTask",
        updateVideoUrl: base + "/admin/updateVideoTask",
        getAllHandlersUrl: base + "/admin/getAllHandlers"
    },
    resources: {
        getUrl: base + "/admin/getfiles",
        uploadImageUrl: base + "/upload/image",
        uploadVideoUrl: base + "/upload/video",
        uploadAttachmentUrl: base + "/upload/attachment",
    },
    config: {
        getUrl: base + "/admin/getConfigs",
        updateUrl: base + "/admin/updateConfig",
        deleteUrl: base + "/admin/deleteConfig",
    },
    application: {
        getUrl: base + "/admin/getApplications",
        updateUrl: base + "/admin/updateApplication",
        deleteUrl: base + "/admin/deleteApplication"
    },
    user: {
        getUrl: base + "/admin/getUsers",
        addUserUrl: base + "/admin/addUser",
        getUserUrl: base + "/admin/getUser",
        updateUserUrl: base + "/admin/updateUser",
        deleteUserUrl: base + "/admin/deleteUser"
    }
}
function getDate(value) {
    var date = new Date(0);
    date.setMilliseconds(value);
    return date.getFullYear() + "-" + formatMonth((date.getMonth() + 1)) + "-" + formatMonth(date.getDate());
}
function parseBsonTime(value) {
    if (!value) {
        return "";
    } else {
        value = value.$date;
    }
    var date = new Date(0);
    date.setMilliseconds(value);
    return date.getFullYear() + "-" + formatMonth((date.getMonth() + 1)) + "-" + formatMonth(date.getDate()) + " " + formatMonth(date.getHours()) + ":" + formatMonth(date.getMinutes()) + ":" + formatMonth(date.getSeconds());
}
function convertFileSize(value) {
    var size = parseInt(value) / 1024;
    if (size > 1024) {
        size = size / 1024;
        if (size > 1024) {
            size = size / 1024;
            return size.toFixed(2) + " GB";
        } else {
            return size.toFixed(2) + " MB";
        }
    } else {
        return size.toFixed(2) + " KB";
    }
}
function formatMonth(month) {
    return month.toString().length == 1 ? "0" + month : month;
}
function ConvertHandlerState(value) {
    switch (value) {
        case 0:
            return "idle";
            break;
        case 1:
            return "running";
            break;
        case -1:
            return "offline";
            break;
    }
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
function getEchartOptionLine(data) {
    return {
        animation: false,
        axisPointer: {
            show: true,
            snap: true,
            label: {
                show: true,
                backgroundColor: "#000"
            },
            lineStyle: {
                type: "dotted",
            }
        },
        legend: {
            right: 'right',
            top: 10,
            itemWidth: 35,
            itemHeight: 12,
            data: [{
                name: "resource",
                icon: "roundRect"
            }, {
                name: "task",
                icon: "roundRect"
            }]
        },
        grid: {
            left: "5%",
            top: "10%",
            bottom: "15%",
            right: "17%",
        },
        xAxis: {
            data: data,
            axisLine: {
                lineStyle: {
                    color: "#484848",
                    opacity: 0.6
                }
            },
            axisTick: {
                alignWithLabel: true
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: "dashed",
                    color: "#e4e4e4"
                }
            }
        },
        yAxis: {
            axisLine: {
                lineStyle: {
                    color: "#484848",
                    opacity: 0.6
                }
            },
            minInterval: 3,
            axisTick: {
                show: false
            },
            axisLabel: {
                showMinLabel: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: "dashed",
                    color: "#e4e4e4"
                }
            }
        },
        series: [{
            name: "resource",
            type: 'line',
            showSymbol: false,
            symbol: "circle",
            lineStyle: {
                normal: {
                    color: "#C35C00",
                    width: 1
                }
            },
            itemStyle: {
                normal: {
                    color: "#C35C00",
                }
            },
            smooth: false,
            data: []
        }, {
            name: "task",
            type: 'line',
            showSymbol: false,
            symbol: "circle",
            lineStyle: {
                normal: {
                    color: "#E1301E",
                    width: 1
                }
            },
            itemStyle: {
                normal: {
                    color: "#E1301E"
                }
            },
            smooth: false,
            data: []
        }]
    };
}
function getEchartOptionBar(xData, yData) {
    return {
        animation: false,
        axisPointer: {
            show: true,
            snap: true,
            label: {
                show: true,
                backgroundColor: "#000"
            },
            lineStyle: {
                type: "dotted",
            }
        },
        grid: {
            left: "5%",
            top: "10%",
            bottom: "15%",
            right: "5%",
        },
        xAxis: {
            type: 'category',
            data: xData,
            axisTick: {
                alignWithLabel: true
            },
            axisLine: {
                lineStyle: {
                    color: "#484848",
                    opacity: 0.6
                }
            },
        },
        yAxis: {
            type: 'value',
            minInterval: 3,
            axisLine: {
                lineStyle: {
                    color: "#484848",
                    opacity: 0.6
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                showMinLabel: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: "dashed",
                    color: "#e4e4e4"
                }
            }
        },
        series: [
            {
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: "top"
                    }
                },
                barWidth: '30%',
                data: yData,
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList = ["#C35C00", "#E1301E", "#968c6d", "#ffb600", "#602020", "#6d6e71", "#db536a", "#dc6900"];
                            return colorList[params.dataIndex % colorList.length];
                        },
                        opacity: 0.6
                    }
                }
            }
        ]
    }
}
Array.prototype.sortAndUnique = function () {
    this.sort(); //先排序
    var res = [this[0]];
    for (var i = 1; i < this.length; i++) {
        if (this[i] !== res[res.length - 1]) {
            res.push(this[i]);
        }
    }
    return res;
}