const express = require('express');
const router = express.Router();

const Posts = require('../schemas/post.js');
const Comments = require('../schemas/comment.js');


// 댓글 생성 API
router.post('/:postId/comments', async (req, res) => {
    const postId = req.params.postId;
    const [post] = await Posts.find({ postId });
    // return res.send(postId)
    try{
        // let check = new ObjectId(postId); // ObjectId 형식 검사
        // let underId = check.toString();
        const {commentId, user, password, content} = req.body;
        if (!post) {
            return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
        }
        if(
            !postId ||
            !user ||
            !password
        ){
            return res.status(400).json({
                message: "데이터 형식이 올바르지 않습니다."
            });
        }

        if(!content){
            return res.status(400).json({
                message: "댓글 내용을 입력해주세요."
            })
        }

        const createdAt = new Date();

        await Comments.create({ commentId, postId, user, password, content });
        return res.status(200).json({
            message: "댓글이 생성되었습니다."
        });
    }catch(err) {
        return res.status(400).json({
            message: "데이터 형식이 올바르지 않습니다."
        });
    }

    res.json({ message : "댓글을 생성하였습니다." });

});


// 댓글 조회 : GET -> localhost:3000/posts/:postId/comments
router.get('/:postId/comments', async(req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comments.find({"postId":postId}, {"_id":0, "__v":0, "password":0});
        const [post] = await Posts.find({ postId });
        if (!post) {
            return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
        }
        res.json({ "data" : comments })
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' });
    }
})


// 댓글 수정 : PUT -> localhost:3000/posts/:postId/comments/:commentId
router.put('/:postId/comments/:commentId', async(req, res) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const [post] = await Posts.find({ postId });
        const [comment] = await Comments.find({ commentId });
        const { password, content } = req.body;
        if (!post) {
            return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
        }
        if (!comment) {
            return res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
        }
        if (password === comment.password) {
            await Comments.updateOne({ commentId: commentId }, { $set: { content: content } })
            return res.status(200).json({ message: '댓글을 수정하였습니다.' });
        } else {
            return res.status(404).json({ message: '비밀번호가 다릅니다.' });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' });
    }
});


// 댓글 삭제 : DELETE -> localhost:3000/posts/:postId/comments/:commentId
router.delete('/:postId/comments/:commentId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const [post] = await Posts.find({ postId });
        const [comment] = await Comments.find({ commentId });
        const { password } = req.body;
        if (!post) {
            return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
        }
        if (!comment) {
            return res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
        }
        if (password === comment.password) {
            await Comments.deleteOne({ commentId: commentId })
            return res.status(200).json({ message: '댓글을 삭제하였습니다.' });
        } else {
            return res.status(404).json({ message: '비밀번호가 다릅니다.' });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' })
    }
})


module.exports = router;