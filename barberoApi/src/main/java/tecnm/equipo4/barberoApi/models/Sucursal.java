package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sucursal")
public class Sucursal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idSucursal")
    private Long idSucursal;

    @Column(name = "nombreSucursal", nullable = false)
    private String nombreSucursal;

    @Column(name = "direccionSucursal")
    private String direccion;

    @JsonIgnore
    @OneToMany(mappedBy = "sucursal", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Barbero> barberos = new ArrayList<>();

    @JsonCreator
    public Sucursal(@JsonProperty("idSucursal") Long idSucursal) {
        this.idSucursal = idSucursal;
    }
}