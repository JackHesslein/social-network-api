import { Request, Response } from 'express';
import  Thought from '..//models/Thought.js';

/**
 * GET All Thoughts /thoughts
 * @returns an array of Thoughts
*/
export const getAllThoughts = async(_req: Request, res: Response) => {
    try{
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
};

/**
 * GET Thought by ID /thoughts/:id
 * @param string id
 * @returns a single Thought
*/
export const getThoughtById = async(req: Request, res: Response) => {
    const { id } = req.params;
    try{
        const thought = await Thought.findById(id);
        if(!thought){
            res.status(404).json({message: 'No thought found with this id!'});
        }
        res.json(thought);
    }   catch (error: any) {
            res.status(500).json({message: error.message});
    }
};

/**
 * POST Create a Thought /thoughts
 * @param string thoughtText
 * @param string username
 * @returns a single Thought
*/
export const createThought = async(req: Request, res: Response) => {
    const { thoughtText, username } = req.body;
    try{
        const newThought = await Thought.create({ thoughtText, username });
        res.json(newThought);
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
};

/**
 * PUT Update a Thought /thoughts/:id
 * @param object id, thoughtText, username
 * @returns a single Thought object
*/
export const updateThought = async(req: Request, res: Response) => {
    try {
        const updatedThought = await Thought.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!updatedThought){
            res.status(404).json({message: 'No thought found with this id!'});
        }
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
};

/**
 * DELETE Remove a Thought /thoughts/:id
 * @param string id
 * @returns string
*/
export const deleteThought = async(req: Request, res: Response) => {
    try {
        const deletedThought = await Thought.findByIdAndDelete(req.params.id);
        if(!deletedThought){
            res.status(404).json({message: 'No thought found with this id!'});
        }
        res.json({message: 'Thought deleted!'});
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
};

export const createReaction = async(req: Request, res: Response) => {
    //@ts-ignore
    const { reactionBody, username } = req.body;
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        );
    
    if (!thought) {
        return res
            .status(404)
            .json({ message: 'No thought found'})
    }
    return res.json(thought);
    } catch (err) {
        return res.status(500).json(err);
    }

}

export const deleteReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res
                .status(404)
                .json({ message: 'No thought found with that ID :(' });
        }

        return res.json(thought);
    } catch (err) {
        return res.status(500).json(err);
    }
};