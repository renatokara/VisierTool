select {STAR_NAME} as "STAR_NAME" {SELECT_FIELDS} from {TABLE}
where
({RA_COLUMN} between  {RA} - 0.01  and {RA} + 0.01)
and
({DE_COLUMN} between  {DEC} - 0.01 and {DEC} + 0.01)

and sqrt(power({RA} - {RA_COLUMN}, 2) + power({DEC} - {DE_COLUMN}, 2) ) < 0.001;
