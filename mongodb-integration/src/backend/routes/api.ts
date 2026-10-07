import { Router } from 'express';
import { getItems, createItem, updateItem, deleteItem } from '../controllers/itemController';

const router = Router();

export const setApiRoutes = (app) => {
    app.use('/api/items', router);

    router.get('/', getItems);
    router.post('/', createItem);
    router.put('/:id', updateItem);
    router.delete('/:id', deleteItem);
};