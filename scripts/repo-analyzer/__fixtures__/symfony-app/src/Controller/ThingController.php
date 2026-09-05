<?php

namespace Acme\Controller;

class ThingController
{
    public function list()
    {
        return $this->render(new Component('thing-list'));
    }
}
