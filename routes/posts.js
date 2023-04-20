const express = require('express');
const router = express.Router();

const Posts = require('../schemas/post.js');


// 게시글 생성 : POST -> localhost:3000/posts
router.post('/', async (req, res) => {
    try {
        const { postId, user, password, title, content } = req.body;
        const post = await Posts.find({ postId });
        if (post.length) {
            return res.status(404).send({ message: "이미 있는 데이터입니다." });
        };
        await Posts.create({ postId, user, password, title, content });
        return res.status(200).json({ message: '게시글을 생성하였습니다.' })
    } catch {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
});
// 게시글 전체 조회
router.get('/', async (req, res) => {
    try {
        const post = await Posts.find({}, { "_id":0, "password":0, "__v":0 });
        
        res.json({ data: post });
    } catch {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
});
// 게시글 상세 조회 : GET -> localhost:3000/posts/:postId
router.get('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Posts.findOne({ postId: postId }, { "_id":0, "password":0, "__v":0 });
        if (!post) {
            return res.status(400).json({ message: '게시글 조회에 실패하였습니다.' });
        }
        res.json({ data: post });
    } catch {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
});
// 게시글 수정 : PUT -> localhost:3000/posts/:postId
router.put('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const { password, title, content } = req.body;
        const [ post ] = await Posts.find({ postId });
        if (!post) {
            return res.status(400).json({ message: '게시글 조회에 실패하였습니다.' });
        }
        if ( password === post.password ) {
            await Posts.updateOne({ postId }, { $set: { title, content } });
            return res.status(200).json({ message: '게시글을 수정하였습니다.' })
        } else {
            return res.status(400).json({ message: '비밀번호가 다릅니다.' });
        }
    } catch {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
});
// 게시글 삭제 : DELETE -> localhost:3000/posts/:postId
router.delete('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const { password } = req.body;
        const [ post ] = await Posts.find({ postId });
        if (!post) {
            return res.status(400).json({ message: '게시글 조회에 실패하였습니다.' });
        }
        if ( password === post.password ) {
            await Posts.deleteOne({ postId });
            return res.status(200).json({ message: '게시글을 삭제하였습니다.' })
        } else {
            return res.status(400).json({ message: '비밀번호가 다릅니다.' });
        }
    } catch {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
});




module.exports = router;