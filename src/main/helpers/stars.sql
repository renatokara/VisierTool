select {STAR_NAME} as "STAR_NAME" {SELECT_FIELDS} from {TABLE}
where
({RA_COLUMN} between  {RA} - 0.016  and {RA} + 0.016)
and
({DE_COLUMN} between  {DEC} - 0.016 and {DEC} + 0.016)

and sqrt(power({RA} - {RA_COLUMN}, 2) + power({DEC} - {DE_COLUMN}, 2) ) < 0.016;
