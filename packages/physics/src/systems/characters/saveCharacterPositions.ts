import { Position } from "@lattice-engine/scene";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { CharacterController } from "../../components";
import { PhysicsStore } from "../../PhysicsStore";

export function saveCharacterPositions(
  store: Res<PhysicsStore>,
  characters: Query<[Entity, Mut<Position>], With<CharacterController>>
) {
  for (const [entity, position] of characters) {
    const collider = store.getCollider(entity.id);
    const rigidbody = store.getRigidBody(entity.id);

    const translation = rigidbody?.translation() ?? collider?.translation();
    if (!translation) continue;

    position.x = translation.x;
    position.y = translation.y;
    position.z = translation.z;
  }
}
