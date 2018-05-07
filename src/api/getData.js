import fetch from '../config/fetch'

// 使用代理改变参数
let proxy = new Proxy(fetch, {
  apply (target, ctx, args) {
    args[0] = 'http://localhost:3000' + args[0]
    return Reflect.apply(...arguments)
  }
})
// 手机号登录(明文登录不安全，但是我不会改后端源码啊)
export const login = (phone, password) => proxy('/login/cellphone', {
  params: {
    phone,
    password
  }
})
// 刷新登录
export const refresh = () => proxy('/login/refresh')
// 获取用户详情
export const userDetail = uid => proxy('/user/detail', {
  params: {
    uid
  }
})
// 获取用户信息，歌单、收藏、mv和dj数量
export const subcount = () => proxy('/user/subcount')
// 获取用户歌单
export const playlist = uid => proxy('/user/playlist', {
  params: {
    uid
  }
})
// 获取用户电台
export const dj = uid => proxy('/user/dj', {
  uid
})
// 获取用户关注列表
export const follows = (uid, limit = 30, offset = 0) => proxy('/user/follows', {
  uid,
  limit,
  offset
})
// 获取用户粉丝列表
export const followeds = (uid, limit = 30, offset = 0) => proxy('/user/followeds', {
  params: {
    uid,
    limit,
    offset
  }
})
// 获取用户动态
export const userEvent = uid => proxy('/user/event', {
  params: {
    uid
  }
})
// 获取用户播放记录
export const record = (uid, type = 1) => proxy('/user/record', {
  params: {
    uid,
    type
  }
})
// 获取动态消息
export const event = () => proxy('/event')
// 获取精品歌单
export const highquality = (cat = '全部', limit = 20) => proxy('/top/playlist/highquality', {
  params: {
    cat,
    limit
  }
})
// 获取歌单详情
export const playlistDetail = playlistId => proxy('/playlist/detail', {
  params: {
    id: playlistId
  }
})
// 获取音乐url
export const musicUrl = musicId => proxy('/music/url', {
  params: {
    id: musicId
  }
})
// 搜索
export const search = (keywords, limit = 30, offset = 0) => proxy('/search', {
  params: {
    keywords,
    limit,
    offset
  }
})
// 搜索建议
export const suggest = (keywords, limit = 30, offset = 0, type = 1) => proxy('/search/suggest', {
  keywords,
  limit,
  offset,
  type
})
// 搜索多重匹配
export const multimatch = keywords => proxy('/search/multimatch', {
  params: {
    keywords
  }
})
// 对歌单歌内曲添加或删除
export const playlistTrim = (op, pid, tracks) => proxy('/playlist/tracks', {
  params: {
    op,
    pid,
    tracks
  }
})
// 获取歌词
export const lyric = musicId => proxy('/lyric', {
  params: {
    id: musicId
  }
})
// 歌曲评论
export const comment = (musicId, limit = 20, offset = 0) => proxy('/comment/music', {
  params: {
    id: musicId,
    limit,
    offset
  }
})
// 专辑评论
export const albumComment = (musicId, limit = 20, offset = 0) => proxy('/comment/album', {
  params: {
    id: musicId,
    limit,
    offset
  }
})
// 歌单评论
export const playlistComment = (musicId, limit = 20, offset = 0) => proxy('/comment/playlist', {
  id: musicId,
  limit,
  offset
})
// MV评论
export const MVComment = (MVId, limit = 20, offset = 0) => proxy('/comment/mv', {
  id: musicId,
  limit,
  offset
})
// 电台节目评论
export const djComment = (djId, limit, offset) => proxy('/comment/dj', {
  params: {
    id: djId,
    limit,
    offset
  }
})
// 给评论点赞
export const like = (id, cid, t, type) => proxy('comment/like', {
  params: {
    id,
    cid,
    t,
    type
  }
})
// 获取轮播图
export const banner = () => proxy('/banner')
// 获取歌曲详情
export const musicDetail = musicId => proxy('/song/detail', {
  params: {
    ids: musicId
  }
})
// 获取专辑内容
export const album = albumId => proxy('/album', {
  params: {
    id: albumId
  }
})
// 获取歌手歌单
export const artists = artistId => proxy('/artists', {
  params: {
    id: artistId
  }
})
// 获取歌手mv
export const artistMV = artistId => proxy('/artist/mv', {
  params: {
    id: artistId
  }
})
// 获取歌手专辑
export const artistAlbum = (artistId, limit = 50) => proxy('/artist/album', {
  params: {
    id: artistId,
    offset
  }
})
// 获取歌手描述
export const artistDesc = artistId => proxy('/artist/desc', {
  params: {
    id: artistId
  }
})
// 获取相似歌手
export const artistSimi = artistId => proxy('/simi/artist', {
  params: {
    id: artistId
  }
})
// 获取相似歌单
export const playlistSimi = musicId => proxy('/simi/playlist', {
  params: {
    id: musicId
  }
})
// 相似mv
export const mvSimi = mvid => proxy('/simi/mv', {
  params: {
    mvid
  }
})
// 获取相似音乐
export const songSimi = musicId => proxy('/simi/song', {
  params: {
    id: musicId
  }
})
// 获取最近5个听了这首歌的用户
export const userSimi = musicId => proxy('/simi/user', {
  id: musicId
})
// 获取每日推荐歌单
export const recommendAlbum = () => proxy('/recommend/resource')
// 获取每日推荐歌曲
export const recommendSongs = () => proxy('/recommend/songs')
// 私人FM
export const FM = () => proxy('/personal_fm')
// 签到
export const dailySignin = (type = 0) => proxy('/daily_signin', {
  params: {
    type
  }
})
// 喜欢音乐
export const likeMusic = (musicId, like = true) => proxy('/like', {
  params: {
    id: musicId,
    like
  }
})
// 垃圾桶
export const fmTrash = musicId => proxy('/fm_trash', {
  params: {
    id: musicId
  }
})
// 歌单（网游精选碟）
export const playlistTop = (order = 'hot') => proxy('/top/playlist', {
  order
})
// 新碟上架
export const albumTop = (limit = 50, offset = 0) => proxy('/top/album', {
  params: {
    limit,
    offset
  }
})
// 热门歌手
export const artistsTop = (limit = 50, offset = 0) => proxy('/top/artists', {
  params: {
    limit,
    offset
  }
})
// 最新mv
export const mvFirst = (limit = 30) => proxy('/mv/first', {
  params: {
    limit
  }
})
// 推荐mv
export const personalizedMV = () => proxy('/personalized/mv')
// 推荐歌单
export const personalizedAlbum = () => proxy('/personalized')
// 推荐新音乐
export const personalizedSong = () => proxy('/personalized/newsong')
// 推荐电台
export const personalizedDj = () => proxy('/personalized/djprogram')
// 推荐节目
export const personalizedProgram = () => proxy('/program/recommend')
// 独家放送
export const privateContent = () => proxy('/personalized/privatecontent')
// mv排行
export const mvTop = (limit = 30, offset = 0) => proxy('top/mv', {
  params: {
    limit,
    offset
  }
})
// 获取mv数据
export const mv = mvid => proxy('/mv', {
  mvid
})
// 播放mv
export const mvPlay = url => proxy('/mv/url', {
  url
})
// 排行榜
export const listTop = idx => proxy('/top/list', {
  idx
})
// 歌手榜
export const artistTop = () => proxy('/toplist/artist')
// 云盘
export const cloud = () => proxy('/user/cloud')
// 电台推荐
export const recommendDj = () => proxy('/dj/recommend')
// 电台分类
export const catelist = () => proxy('/dj/catelist')
// 电台分类推荐
export const recommendDjCate = type => proxy('/dj/recommend/type', {
  type
})
// 电台订阅
export const subscribe = (rid, t) => proxy('/dj/sub', {
  params: {
    rid,
    t
  }
})
// 电台详情
export const djDetail = rid => proxy('/dj/detail', {
  params: {
    rid
  }
})
// 电台节目
export const djProgram = rid => proxy('/dj/program', {
  params: {
    rid
  }
})
