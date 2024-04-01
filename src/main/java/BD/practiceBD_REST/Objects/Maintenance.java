package BD.practiceBD_REST.Objects;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class Maintenance {

    private int id;

    private int id_seat;

    private int id_equipment;

    private String installation_date;

    private String removal_date;

}
