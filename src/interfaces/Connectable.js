'use strict';

/**
 * This interface defines behaviors for connection to `AudioNode`.
 * @interface
 */
export class Connectable {
    /**
     * for input
     */
    INPUT() {}

    /**
     * for output
     */
    OUTPUT() {}
}
