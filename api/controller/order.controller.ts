import DefaultController from "./default.controller";
import { Order } from "../entity";

import isAuthenticated from "./auth";

import { Request, Response, Router } from "express";
import { getRepository } from "typeorm";

export class OrderController extends DefaultController {
  protected initializeRoutes(): Router {
    const router = Router();

    router.route("/orders")
    .get(isAuthenticated(false, true), (req: Request, res: Response) => {
      const orderRepo = getRepository(Order);
      orderRepo.find().then((orders: Order[]) => {
        res.status(200).send({ orders });
      }).catch((error: any) => {
        res.status(500).send({ reason: error.message });
      });
    })
    .post(isAuthenticated(false, true), (req: Request, res: Response) => {
      const orderRepo = getRepository(Order);
      const order = new Order();
      // order.productCount = req.body.productCount;
      // etc
      orderRepo.save(order).then(createdOrder => {
        res.status(200).send({ createdOrder });
      }).catch((error: any) => {
        res.status(500).send({ reason: error.message });
      });
    });

    router.route("/orders/:id")
    .get(isAuthenticated(true, false), (req: Request, res: Response) => {
      const orderRepo = getRepository(Order);
      orderRepo.findOne(req.params.id).then((order: Order | undefined) => {
        if (!order) {
          res.sendStatus(404);
          return;
        }
        res.send({ order });
      }).catch((error: any) => {
        res.status(500).send({ reason: error.message });
      });
    })
    .patch(isAuthenticated(false, true), (req: Request, res: Response) => {
      const orderRepo = getRepository(Order);
      orderRepo.findOne({ id: req.params.id }).then((order: Order | undefined) => {
        if (!order) {
          res.status(400).send(`order with id ${req.params.id} not found.`);
          return;
        }
        // order.productCount = req.body.productCount;
        // etc
        orderRepo.save(order).then((updatedOrder: Order) => {
          res.status(200).send({order: updatedOrder});
        });
      }).catch((error: any) => {
        res.status(500).send({ reason: error.message });
      });
    })
    .delete(isAuthenticated(false, true), (req: Request, res: Response) => {
      const orderRepo = getRepository(Order);
      orderRepo.delete({ id: req.params.id }).then((deleteResult: any) => {
        if (deleteResult.raw.affectedRows == 0) {
          res.status(400).send(`order with id ${req.params.id} not found`);
          return;
        }
        res.status(200).send(`order with id ${req.params.id} deleted`);
      }).catch((error: any) => {
        res.status(500).send({ reason: error.message });
      });
    });

    return router;
  }
}

export default OrderController;